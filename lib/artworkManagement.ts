import { PrismaClient, ArtworkStatus, SaleType, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface ArtworkData {
  title: string;
  artist: string;
  description: string;
  categoryId: string;
  year: number;
  medium: string;
  dimensions: string;
  image: string;
  images?: string[];
  startingPrice: number;
  estimatedValue: number;
  reservePrice?: number;
  saleType: SaleType;
  endDate: Date;
  isArtBiddoOwned: boolean;
  certificate?: string;
  provenance?: string;
  condition?: string;
}

export interface SellerRequestData {
  title: string;
  artist: string;
  description: string;
  images: string[];
  suggestedPrice: number;
  category: string;
  medium: string;
  dimensions?: string;
  year?: number;
  provenance?: string;
  certificate?: string;
  userId: string;
}

export class ArtworkManagement {
  // Crear nueva obra (solo para ArtBiddo)
  async createArtwork(data: ArtworkData): Promise<any> {
    try {
      const artwork = await prisma.artwork.create({
        data: {
          ...data,
          currentPrice: data.startingPrice,
          status: 'ACTIVE',
          isArtBiddoOwned: true
        },
        include: {
          category: true
        }
      });

      console.log(`✅ Obra creada: ${artwork.title}`);
      return artwork;
    } catch (error) {
      console.error('❌ Error al crear obra:', error);
      throw error;
    }
  }

  // Crear solicitud de vendedor
  async createSellerRequest(data: SellerRequestData): Promise<any> {
    try {
      const request = await prisma.sellerRequest.create({
        data: {
          ...data,
          status: 'PENDING'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Notificar al admin sobre nueva solicitud
      await this.notifyAdminNewRequest(request);

      console.log(`📝 Solicitud de vendedor creada: ${request.title}`);
      return request;
    } catch (error) {
      console.error('❌ Error al crear solicitud:', error);
      throw error;
    }
  }

  // Aprobar solicitud de vendedor y crear obra
  async approveSellerRequest(
    requestId: string,
    adminNotes: string,
    finalPrice: number,
    commission: number
  ): Promise<any> {
    try {
      const request = await prisma.sellerRequest.findUnique({
        where: { id: requestId },
        include: { user: true }
      });

      if (!request) {
        throw new Error('Solicitud no encontrada');
      }

      // Actualizar estado de la solicitud
      await prisma.sellerRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          adminNotes
        }
      });

      // Crear categoría si no existe
      let category = await prisma.category.findFirst({
        where: { name: request.category }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: request.category,
            description: `Categoría para ${request.category}`,
            image: '/images/categories/default.jpg'
          }
        });
      }

      // Crear la obra
      const artwork = await prisma.artwork.create({
        data: {
          title: request.title,
          artist: request.artist,
          description: request.description,
          categoryId: category.id,
          year: request.year || new Date().getFullYear(),
          medium: request.medium,
          dimensions: request.dimensions || 'No especificado',
          image: request.images[0] || '/images/artworks/default.jpg',
          images: request.images,
          startingPrice: finalPrice,
          currentPrice: finalPrice,
          estimatedValue: finalPrice * 1.2, // 20% más del precio final
          reservePrice: finalPrice * 0.8, // 80% del precio final
          saleType: 'AUCTION',
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
          isArtBiddoOwned: false,
          commission,
          originalSeller: request.user.name,
          certificate: request.certificate,
          provenance: request.provenance,
          condition: 'Excelente'
        },
        include: {
          category: true
        }
      });

      // Notificar al vendedor
      await this.notifySellerRequestApproved(request.user.id, artwork);

      console.log(`✅ Solicitud aprobada y obra creada: ${artwork.title}`);
      return artwork;
    } catch (error) {
      console.error('❌ Error al aprobar solicitud:', error);
      throw error;
    }
  }

  // Rechazar solicitud de vendedor
  async rejectSellerRequest(requestId: string, reason: string): Promise<void> {
    try {
      const request = await prisma.sellerRequest.findUnique({
        where: { id: requestId },
        include: { user: true }
      });

      if (!request) {
        throw new Error('Solicitud no encontrada');
      }

      // Actualizar estado de la solicitud
      await prisma.sellerRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          adminNotes: reason
        }
      });

      // Notificar al vendedor
      await this.notifySellerRequestRejected(request.user.id, reason);

      console.log(`❌ Solicitud rechazada: ${request.title}`);
    } catch (error) {
      console.error('❌ Error al rechazar solicitud:', error);
      throw error;
    }
  }

  // Obtener todas las obras de ArtBiddo
  async getArtBiddoArtworks(): Promise<any[]> {
    return await prisma.artwork.findMany({
      where: { isArtBiddoOwned: true },
      include: {
        category: true,
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Obtener obras de terceros aprobadas
  async getThirdPartyArtworks(): Promise<any[]> {
    return await prisma.artwork.findMany({
      where: { isArtBiddoOwned: false },
      include: {
        category: true,
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Obtener solicitudes de vendedores
  async getSellerRequests(status?: RequestStatus): Promise<any[]> {
    const where = status ? { status } : {};
    
    return await prisma.sellerRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Actualizar obra
  async updateArtwork(artworkId: string, data: Partial<ArtworkData>): Promise<any> {
    try {
      const artwork = await prisma.artwork.update({
        where: { id: artworkId },
        data,
        include: {
          category: true
        }
      });

      console.log(`✅ Obra actualizada: ${artwork.title}`);
      return artwork;
    } catch (error) {
      console.error('❌ Error al actualizar obra:', error);
      throw error;
    }
  }

  // Cambiar estado de obra
  async updateArtworkStatus(artworkId: string, status: ArtworkStatus): Promise<any> {
    try {
      const artwork = await prisma.artwork.update({
        where: { id: artworkId },
        data: { status },
        include: {
          category: true
        }
      });

      console.log(`✅ Estado de obra actualizado: ${artwork.title} -> ${status}`);
      return artwork;
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      throw error;
    }
  }

  // Eliminar obra (solo para obras no vendidas)
  async deleteArtwork(artworkId: string): Promise<void> {
    try {
      const artwork = await prisma.artwork.findUnique({
        where: { id: artworkId }
      });

      if (!artwork) {
        throw new Error('Obra no encontrada');
      }

      if (artwork.status === 'SOLD') {
        throw new Error('No se puede eliminar una obra vendida');
      }

      await prisma.artwork.delete({
        where: { id: artworkId }
      });

      console.log(`🗑️ Obra eliminada: ${artwork.title}`);
    } catch (error) {
      console.error('❌ Error al eliminar obra:', error);
      throw error;
    }
  }

  // Obtener estadísticas de obras
  async getArtworkStatistics() {
    const totalArtworks = await prisma.artwork.count();
    const artBiddoArtworks = await prisma.artwork.count({
      where: { isArtBiddoOwned: true }
    });
    const thirdPartyArtworks = await prisma.artwork.count({
      where: { isArtBiddoOwned: false }
    });
    const activeAuctions = await prisma.artwork.count({
      where: { status: 'ACTIVE' }
    });
    const soldArtworks = await prisma.artwork.count({
      where: { status: 'SOLD' }
    });

    const totalValue = await prisma.artwork.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { estimatedValue: true }
    });

    const totalRevenue = await prisma.artwork.aggregate({
      where: { status: 'SOLD' },
      _sum: { currentPrice: true }
    });

    return {
      totalArtworks,
      artBiddoArtworks,
      thirdPartyArtworks,
      activeAuctions,
      soldArtworks,
      totalValue: totalValue._sum.estimatedValue || 0,
      totalRevenue: totalRevenue._sum.currentPrice || 0,
      averagePrice: totalArtworks > 0 ? (totalValue._sum.estimatedValue || 0) / totalArtworks : 0
    };
  }

  // Obtener obras por categoría
  async getArtworksByCategory(categoryId: string): Promise<any[]> {
    return await prisma.artwork.findMany({
      where: { categoryId },
      include: {
        category: true,
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Buscar obras
  async searchArtworks(query: string): Promise<any[]> {
    return await prisma.artwork.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { artist: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        category: true,
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Obtener obras destacadas
  async getFeaturedArtworks(limit: number = 6): Promise<any[]> {
    return await prisma.artwork.findMany({
      where: { status: 'ACTIVE' },
      include: {
        category: true,
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: [
        { totalBids: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  }

  // Notificar al admin sobre nueva solicitud
  private async notifyAdminNewRequest(request: any): Promise<void> {
    // Aquí podrías implementar notificaciones por email, push, etc.
    console.log(`📧 Nueva solicitud de vendedor: ${request.title} por ${request.user.name}`);
  }

  // Notificar al vendedor que su solicitud fue aprobada
  private async notifySellerRequestApproved(userId: string, artwork: any): Promise<void> {
    await prisma.notification.create({
      data: {
        type: 'SYSTEM',
        title: 'Solicitud Aprobada',
        message: `Tu obra "${artwork.title}" ha sido aprobada y añadida a las subastas de ArtBiddo.`,
        userId
      }
    });
  }

  // Notificar al vendedor que su solicitud fue rechazada
  private async notifySellerRequestRejected(userId: string, reason: string): Promise<void> {
    await prisma.notification.create({
      data: {
        type: 'SYSTEM',
        title: 'Solicitud Rechazada',
        message: `Tu solicitud ha sido rechazada. Motivo: ${reason}`,
        userId
      }
    });
  }

  // Obtener obras que necesitan atención (subastas próximas a finalizar)
  async getArtworksNeedingAttention(): Promise<any[]> {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return await prisma.artwork.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: oneDayFromNow,
          gt: now
        }
      },
      include: {
        category: true,
        bids: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { endDate: 'asc' }
    });
  }

  // Finalizar subasta automáticamente
  async finalizeAuction(artworkId: string): Promise<any> {
    try {
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

      if (!artwork) {
        throw new Error('Obra no encontrada');
      }

      if (artwork.bids.length === 0) {
        // No hay pujas, marcar como expirada
        await prisma.artwork.update({
          where: { id: artworkId },
          data: { status: 'EXPIRED' }
        });
        return { status: 'EXPIRED', winner: null };
      }

      const winningBid = artwork.bids[0];
      const winner = winningBid.user;

      // Marcar obra como vendida
      await prisma.artwork.update({
        where: { id: artworkId },
        data: { status: 'SOLD' }
      });

      // Marcar puja ganadora
      await prisma.bid.update({
        where: { id: winningBid.id },
        data: { status: 'WON' }
      });

      // Notificar al ganador
      await prisma.notification.create({
        data: {
          type: 'AUCTION_WON',
          title: '¡Has ganado la subasta!',
          message: `¡Felicidades! Has ganado la subasta de "${artwork.title}". La obra se ha añadido a tu carrito de compra.`,
          userId: winner.id
        }
      });

      console.log(`🏆 Subasta finalizada: ${artwork.title} ganada por ${winner.name}`);
      return { status: 'SOLD', winner };
    } catch (error) {
      console.error('❌ Error al finalizar subasta:', error);
      throw error;
    }
  }
}

// Instancia global del sistema de gestión de obras
export const artworkManagement = new ArtworkManagement();
