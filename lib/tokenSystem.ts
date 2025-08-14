import { PrismaClient, TransactionType, TransactionStatus } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  pricePerToken: number;
  bonus?: number;
  popular?: boolean;
}

export class TokenSystem {
  private tokenPackages: TokenPackage[] = [
    {
      id: 'starter',
      tokens: 50,
      price: 25,
      pricePerToken: 0.5,
      bonus: 0
    },
    {
      id: 'popular',
      tokens: 100,
      price: 45,
      pricePerToken: 0.45,
      bonus: 10,
      popular: true
    },
    {
      id: 'premium',
      tokens: 250,
      price: 100,
      pricePerToken: 0.4,
      bonus: 50
    },
    {
      id: 'vip',
      tokens: 500,
      price: 180,
      pricePerToken: 0.36,
      bonus: 150
    },
    {
      id: 'collector',
      tokens: 1000,
      price: 300,
      pricePerToken: 0.3,
      bonus: 400
    }
  ];

  // Obtener paquetes de tokens disponibles
  getTokenPackages(): TokenPackage[] {
    return this.tokenPackages;
  }

  // Obtener paquete por ID
  getTokenPackage(packageId: string): TokenPackage | undefined {
    return this.tokenPackages.find(pkg => pkg.id === packageId);
  }

  // Calcular tokens totales incluyendo bonificación
  calculateTotalTokens(packageId: string): number {
    const pkg = this.getTokenPackage(packageId);
    if (!pkg) return 0;
    return pkg.tokens + (pkg.bonus || 0);
  }

  // Crear intención de pago para compra de tokens
  async createTokenPurchaseIntent(
    userId: string,
    packageId: string
  ): Promise<{ paymentIntent: Stripe.PaymentIntent; tokenPurchase: any }> {
    const pkg = this.getTokenPackage(packageId);
    if (!pkg) {
      throw new Error('Paquete de tokens no encontrado');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const totalTokens = this.calculateTotalTokens(packageId);

    // Crear registro de compra de tokens
    const tokenPurchase = await prisma.tokenPurchase.create({
      data: {
        tokens: totalTokens,
        price: pkg.price,
        pricePerToken: pkg.pricePerToken,
        status: 'PENDING',
        userId
      }
    });

    // Crear intención de pago en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(pkg.price * 100), // Stripe usa centavos
      currency: 'eur',
      metadata: {
        tokenPurchaseId: tokenPurchase.id,
        userId,
        packageId,
        tokens: totalTokens.toString()
      },
      customer: user.stripeCustomerId || undefined,
      description: `Compra de ${totalTokens} tokens - ArtBiddo`
    });

    // Actualizar registro con ID de intención de pago
    await prisma.tokenPurchase.update({
      where: { id: tokenPurchase.id },
      data: { stripePaymentIntentId: paymentIntent.id }
    });

    return { paymentIntent, tokenPurchase };
  }

  // Confirmar compra de tokens después del pago exitoso
  async confirmTokenPurchase(paymentIntentId: string): Promise<void> {
    const tokenPurchase = await prisma.tokenPurchase.findFirst({
      where: { stripePaymentIntentId: paymentIntentId }
    });

    if (!tokenPurchase) {
      throw new Error('Compra de tokens no encontrada');
    }

    // Actualizar estado de la compra
    await prisma.tokenPurchase.update({
      where: { id: tokenPurchase.id },
      data: { status: 'COMPLETED' }
    });

    // Añadir tokens al usuario
    await prisma.user.update({
      where: { id: tokenPurchase.userId },
      data: {
        tokens: { increment: tokenPurchase.tokens }
      }
    });

    // Crear transacción
    await prisma.transaction.create({
      data: {
        type: 'TOKEN_PURCHASE',
        amount: tokenPurchase.price,
        tokens: tokenPurchase.tokens,
        description: `Compra de ${tokenPurchase.tokens} tokens`,
        status: 'COMPLETED',
        userId: tokenPurchase.userId
      }
    });

    // Crear notificación
    await prisma.notification.create({
      data: {
        type: 'TOKEN_PURCHASE',
        title: 'Tokens Comprados Exitosamente',
        message: `Has recibido ${tokenPurchase.tokens} tokens. ¡Ya puedes pujar en las subastas!`,
        userId: tokenPurchase.userId
      }
    });
  }

  // Realizar puja con tokens
  async placeBidWithTokens(
    userId: string,
    artworkId: string,
    tokenAmount: number
  ): Promise<{ success: boolean; message: string; bid?: any; extended?: boolean }> {
    // Verificar que el usuario tiene suficientes tokens
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (user.tokens < tokenAmount) {
      return { success: false, message: 'Tokens insuficientes' };
    }

    // Verificar que la subasta está activa
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId }
    });

    if (!artwork || artwork.status !== 'ACTIVE') {
      return { success: false, message: 'Subasta no disponible' };
    }

    if (new Date() > artwork.endDate) {
      return { success: false, message: 'Subasta finalizada' };
    }

    // Verificar que la puja es válida (mínimo 1 token)
    if (tokenAmount < 1) {
      return { success: false, message: 'Mínimo 1 token por puja' };
    }

    try {
      // Crear la puja
      const bid = await prisma.bid.create({
        data: {
          amount: tokenAmount,
          isBot: false,
          artworkId,
          userId,
          status: 'ACTIVE'
        }
      });

      // Descontar tokens del usuario
      await prisma.user.update({
        where: { id: userId },
        data: {
          tokens: { decrement: tokenAmount },
          totalBids: { increment: 1 }
        }
      });

      // Actualizar precio actual de la obra
      await prisma.artwork.update({
        where: { id: artworkId },
        data: {
          currentPrice: artwork.currentPrice + tokenAmount,
          totalBids: artwork.totalBids + 1
        }
      });

      // Crear transacción
      await prisma.transaction.create({
        data: {
          type: 'BID',
          amount: 0, // No hay dinero real involucrado
          tokens: tokenAmount,
          description: `Puja de ${tokenAmount} tokens en "${artwork.title}"`,
          status: 'COMPLETED',
          userId,
          artworkId
        }
      });

      // Verificar si se debe extender la subasta
      const { auctionTimer } = await import('./auctionTimer');
      const timeRemaining = auctionTimer.calculateTimeRemaining(artwork.endDate);
      let extended = false;

      if (timeRemaining <= 300) { // Últimos 5 minutos
        const shouldExtend = await auctionTimer.shouldExtendAuction(artworkId, timeRemaining);
        if (shouldExtend) {
          extended = await auctionTimer.extendAuction(artworkId, 300); // Extender 5 minutos
        }
      }

      // Notificar a otros pujadores que han sido superados
      await this.notifyOutbidUsers(artworkId, userId);

      return {
        success: true,
        message: extended 
          ? `Puja exitosa: ${tokenAmount} tokens. ¡Subasta extendida por 5 minutos!`
          : `Puja exitosa: ${tokenAmount} tokens`,
        bid,
        extended
      };
    } catch (error) {
      console.error('Error al realizar puja:', error);
      return { success: false, message: 'Error al realizar la puja' };
    }
  }

  // Notificar a usuarios que han sido superados
  private async notifyOutbidUsers(artworkId: string, winningUserId: string): Promise<void> {
    const previousBids = await prisma.bid.findMany({
      where: {
        artworkId,
        userId: { not: winningUserId },
        status: 'ACTIVE'
      },
      include: { user: true }
    });

    for (const bid of previousBids) {
      // Marcar puja como superada
      await prisma.bid.update({
        where: { id: bid.id },
        data: { status: 'OUTBID' }
      });

      // Crear notificación
      await prisma.notification.create({
        data: {
          type: 'BID_OUTBID',
          title: 'Has sido superado',
          message: `Alguien ha pujado más alto en la subasta. ¡Puja de nuevo para no perderla!`,
          userId: bid.userId
        }
      });
    }
  }

  // Obtener historial de tokens de un usuario
  async getUserTokenHistory(userId: string) {
    const tokenPurchases = await prisma.tokenPurchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const tokenTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        tokens: { not: null }
      },
      include: {
        artwork: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      purchases: tokenPurchases,
      transactions: tokenTransactions
    };
  }

  // Obtener estadísticas de tokens
  async getTokenStatistics() {
    const totalTokensSold = await prisma.tokenPurchase.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { tokens: true }
    });

    const totalRevenue = await prisma.tokenPurchase.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { price: true }
    });

    const totalBidsPlaced = await prisma.bid.aggregate({
      where: { isBot: false },
      _sum: { amount: true }
    });

    const activeUsers = await prisma.user.count({
      where: { tokens: { gt: 0 } }
    });

    return {
      totalTokensSold: totalTokensSold._sum.tokens || 0,
      totalRevenue: totalRevenue._sum.price || 0,
      totalBidsPlaced: totalBidsPlaced._sum.amount || 0,
      activeUsers,
      averageTokensPerUser: activeUsers > 0 ? (totalTokensSold._sum.tokens || 0) / activeUsers : 0
    };
  }

  // Reembolsar tokens (para casos especiales)
  async refundTokens(
    userId: string,
    tokenAmount: number,
    reason: string
  ): Promise<boolean> {
    try {
      // Añadir tokens al usuario
      await prisma.user.update({
        where: { id: userId },
        data: {
          tokens: { increment: tokenAmount }
        }
      });

      // Crear transacción de reembolso
      await prisma.transaction.create({
        data: {
          type: 'TOKEN_REFUND',
          amount: 0,
          tokens: tokenAmount,
          description: `Reembolso de ${tokenAmount} tokens: ${reason}`,
          status: 'COMPLETED',
          userId
        }
      });

      // Crear notificación
      await prisma.notification.create({
        data: {
          type: 'SYSTEM',
          title: 'Tokens Reembolsados',
          message: `Has recibido ${tokenAmount} tokens de reembolso: ${reason}`,
          userId
        }
      });

      return true;
    } catch (error) {
      console.error('Error al reembolsar tokens:', error);
      return false;
    }
  }

  // Verificar si un usuario puede pujar
  async canUserBid(userId: string, artworkId: string): Promise<{
    canBid: boolean;
    message: string;
    userTokens: number;
    artworkPrice: number;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId }
    });

    if (!user || !artwork) {
      return {
        canBid: false,
        message: 'Usuario u obra no encontrada',
        userTokens: 0,
        artworkPrice: 0
      };
    }

    if (artwork.status !== 'ACTIVE') {
      return {
        canBid: false,
        message: 'Subasta no activa',
        userTokens: user.tokens,
        artworkPrice: artwork.currentPrice
      };
    }

    if (new Date() > artwork.endDate) {
      return {
        canBid: false,
        message: 'Subasta finalizada',
        userTokens: user.tokens,
        artworkPrice: artwork.currentPrice
      };
    }

    if (user.tokens < 1) {
      return {
        canBid: false,
        message: 'Necesitas al menos 1 token para pujar',
        userTokens: user.tokens,
        artworkPrice: artwork.currentPrice
      };
    }

    return {
      canBid: true,
      message: 'Puedes pujar',
      userTokens: user.tokens,
      artworkPrice: artwork.currentPrice
    };
  }

  // Obtener ranking de usuarios por tokens
  async getTokenLeaderboard(limit: number = 10) {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        tokens: true,
        totalBids: true,
        totalPurchases: true
      },
      orderBy: { tokens: 'desc' },
      take: limit
    });
  }
}

// Instancia global del sistema de tokens
export const tokenSystem = new TokenSystem();
