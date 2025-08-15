import { PrismaClient, TransactionType, TransactionStatus } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
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
  ): Promise<{ paymentIntent: Stripe.PaymentIntent }> {
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

    // Crear intención de pago con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pkg.price * 100, // Stripe usa centavos
      currency: 'eur',
      metadata: {
        userId,
        packageId,
        tokens: this.calculateTotalTokens(packageId).toString()
      }
    });

    return { paymentIntent };
  }

  // Confirmar compra de tokens
  async confirmTokenPurchase(
    paymentIntentId: string,
    userId: string
  ): Promise<{ success: boolean; tokens: number }> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Pago no completado');
      }

      const tokens = parseInt(paymentIntent.metadata.tokens || '0');
      
      // Actualizar balance del usuario
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: tokens } }
      });

      // Crear transacción
      await prisma.transaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          amount: tokens,
          status: 'COMPLETED',
          description: `Compra de ${tokens} tokens`
        }
      });

      return { success: true, tokens };
    } catch (error) {
      console.error('Error confirmando compra de tokens:', error);
      return { success: false, tokens: 0 };
    }
  }

  // Obtener estadísticas de tokens
  async getTokenStatistics(): Promise<{
    totalTokensSold: number;
    totalRevenue: number;
    averageTokensPerUser: number;
  }> {
    const users = await prisma.user.findMany({
      select: { balance: true }
    });

    const totalTokensSold = users.reduce((sum, user) => sum + user.balance, 0);
    const totalRevenue = totalTokensSold * 0.5; // Estimación
    const averageTokensPerUser = users.length > 0 ? totalTokensSold / users.length : 0;

    return {
      totalTokensSold,
      totalRevenue,
      averageTokensPerUser
    };
  }
}
