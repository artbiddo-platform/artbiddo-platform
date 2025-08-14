import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuctionTimerConfig {
  extensionTime: number; // Tiempo de extensión en segundos (ej: 300 = 5 minutos)
  lastMinuteThreshold: number; // Umbral para "último minuto" (ej: 60 = 1 minuto)
  maxExtensions: number; // Máximo número de extensiones por subasta
  snipingWindow: number; // Ventana de sniping en segundos (ej: 30 = 30 segundos)
}

export class AuctionTimer {
  private config: AuctionTimerConfig = {
    extensionTime: 300, // 5 minutos
    lastMinuteThreshold: 60, // 1 minuto
    maxExtensions: 3,
    snipingWindow: 30 // 30 segundos
  };

  // Calcular tiempo restante de una subasta
  calculateTimeRemaining(endDate: Date): number {
    const now = new Date();
    const timeLeft = endDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(timeLeft / 1000)); // Retorna segundos
  }

  // Verificar si una subasta está en modo "última oportunidad"
  isLastMinute(timeRemaining: number): boolean {
    return timeRemaining <= this.config.lastMinuteThreshold;
  }

  // Verificar si una subasta está en ventana de sniping
  isSnipingWindow(timeRemaining: number): boolean {
    return timeRemaining <= this.config.snipingWindow;
  }

  // Verificar si se debe extender la subasta
  shouldExtendAuction(artworkId: string, timeRemaining: number): Promise<boolean> {
    return new Promise(async (resolve) => {
      // Solo extender si queda menos de 5 minutos
      if (timeRemaining > this.config.extensionTime) {
        resolve(false);
        return;
      }

      // Verificar número de extensiones previas
      const artwork = await prisma.artwork.findUnique({
        where: { id: artworkId },
        select: { 
          id: true,
          endDate: true,
          totalBids: true,
          // Aquí podrías añadir un campo para contar extensiones
        }
      });

      if (!artwork) {
        resolve(false);
        return;
      }

      // Verificar si hay actividad reciente (últimos 2 minutos)
      const recentBids = await prisma.bid.count({
        where: {
          artworkId,
          createdAt: {
            gte: new Date(Date.now() - 2 * 60 * 1000) // Últimos 2 minutos
          }
        }
      });

      // Extender si hay actividad reciente y no se ha excedido el límite
      resolve(recentBids > 0);
    });
  }

  // Extender una subasta
  async extendAuction(artworkId: string, extensionSeconds: number = 300): Promise<boolean> {
    try {
      const artwork = await prisma.artwork.findUnique({
        where: { id: artworkId }
      });

      if (!artwork || artwork.status !== 'ACTIVE') {
        return false;
      }

      const newEndDate = new Date(artwork.endDate.getTime() + extensionSeconds * 1000);

      await prisma.artwork.update({
        where: { id: artworkId },
        data: { endDate: newEndDate }
      });

      // Crear notificación para todos los pujadores
      const bidders = await prisma.bid.findMany({
        where: { artworkId },
        select: { userId: true },
        distinct: ['userId']
      });

      for (const bidder of bidders) {
        await prisma.notification.create({
          data: {
            type: 'AUCTION_ENDING',
            title: 'Subasta Extendida',
            message: `La subasta de "${artwork.title}" ha sido extendida por ${extensionSeconds / 60} minutos debido a actividad reciente.`,
            userId: bidder.userId
          }
        });
      }

      console.log(`⏰ Subasta ${artwork.title} extendida hasta ${newEndDate}`);
      return true;
    } catch (error) {
      console.error('Error al extender subasta:', error);
      return false;
    }
  }

  // Formatear tiempo restante para mostrar
  formatTimeRemaining(seconds: number): string {
    if (seconds <= 0) {
      return 'Finalizada';
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  // Obtener clase CSS para el estado del tiempo
  getTimeStatusClass(timeRemaining: number): string {
    if (timeRemaining <= 0) {
      return 'text-red-600 font-bold';
    } else if (this.isSnipingWindow(timeRemaining)) {
      return 'text-red-500 font-bold animate-pulse';
    } else if (this.isLastMinute(timeRemaining)) {
      return 'text-orange-500 font-semibold';
    } else if (timeRemaining <= 300) { // Últimos 5 minutos
      return 'text-yellow-600 font-medium';
    } else {
      return 'text-gray-600';
    }
  }

  // Verificar si una subasta debe finalizarse
  async checkAuctionEnd(artworkId: string): Promise<boolean> {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: {
        bids: {
          where: { status: 'ACTIVE' },
          orderBy: { amount: 'desc' },
          take: 1,
          include: { user: true }
        }
      }
    });

    if (!artwork || artwork.status !== 'ACTIVE') {
      return false;
    }

    const timeRemaining = this.calculateTimeRemaining(artwork.endDate);
    
    if (timeRemaining <= 0) {
      // Finalizar subasta
      if (artwork.bids.length === 0) {
        // No hay pujas, marcar como expirada
        await prisma.artwork.update({
          where: { id: artworkId },
          data: { status: 'EXPIRED' }
        });
        console.log(`⏰ Subasta ${artwork.title} expirada sin pujas`);
      } else {
        // Hay pujas, marcar como vendida
        const winningBid = artwork.bids[0];
        
        await prisma.artwork.update({
          where: { id: artworkId },
          data: { status: 'SOLD' }
        });

        await prisma.bid.update({
          where: { id: winningBid.id },
          data: { status: 'WON' }
        });

        // Notificar al ganador
        await prisma.notification.create({
          data: {
            type: 'AUCTION_WON',
            title: '¡Has ganado la subasta!',
            message: `¡Felicidades! Has ganado la subasta de "${artwork.title}" por ${winningBid.amount} tokens.`,
            userId: winningBid.userId
          }
        });

        console.log(`🏆 Subasta ${artwork.title} ganada por ${winningBid.user.name}`);
      }
      
      return true;
    }

    return false;
  }

  // Programar verificación de finalización de subasta
  scheduleAuctionEndCheck(artworkId: string): void {
    const checkInterval = setInterval(async () => {
      const artwork = await prisma.artwork.findUnique({
        where: { id: artworkId },
        select: { status: true, endDate: true }
      });

      if (!artwork || artwork.status !== 'ACTIVE') {
        clearInterval(checkInterval);
        return;
      }

      const timeRemaining = this.calculateTimeRemaining(artwork.endDate);
      
      if (timeRemaining <= 0) {
        await this.checkAuctionEnd(artworkId);
        clearInterval(checkInterval);
      }
    }, 1000); // Verificar cada segundo
  }

  // Obtener estadísticas de tiempo de subastas
  async getAuctionTimeStats(): Promise<any> {
    const activeAuctions = await prisma.artwork.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        title: true,
        endDate: true,
        totalBids: true
      }
    });

    const stats = {
      total: activeAuctions.length,
      endingSoon: 0, // Menos de 1 hora
      lastMinute: 0, // Menos de 1 minuto
      sniping: 0, // Menos de 30 segundos
      averageTimeLeft: 0
    };

    let totalTimeLeft = 0;

    activeAuctions.forEach(auction => {
      const timeLeft = this.calculateTimeRemaining(auction.endDate);
      totalTimeLeft += timeLeft;

      if (timeLeft <= 3600) stats.endingSoon++;
      if (timeLeft <= 60) stats.lastMinute++;
      if (timeLeft <= 30) stats.sniping++;
    });

    stats.averageTimeLeft = activeAuctions.length > 0 ? totalTimeLeft / activeAuctions.length : 0;

    return stats;
  }

  // Configurar parámetros del sistema
  updateConfig(newConfig: Partial<AuctionTimerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Obtener configuración actual
  getConfig(): AuctionTimerConfig {
    return { ...this.config };
  }
}

// Instancia global del sistema de tiempo
export const auctionTimer = new AuctionTimer();
