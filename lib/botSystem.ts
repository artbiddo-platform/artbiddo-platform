import { PrismaClient, BotType, BotAction } from '@prisma/client';

const prisma = new PrismaClient();

export interface BotConfig {
  maxBotsPerAuction: number;
  maxBidAmount: number;
  minTimeBetweenBids: number;
  maxDailyBids: number;
  withdrawTime: number;
  priceLimit: number;
}

export interface BotBehavior {
  name: string;
  type: BotType;
  avatar?: string;
  location?: string;
  interests: string[];
  maxBids: number;
  bidAmount: number;
  frequency: number;
  responseProbability: number;
}

export class BotSystem {
  private config: BotConfig = {
    maxBotsPerAuction: 5,
    maxBidAmount: 10,
    minTimeBetweenBids: 30,
    maxDailyBids: 50,
    withdrawTime: 300, // 5 minutos antes del final
    priceLimit: 0.8 // 80% del precio máximo estimado
  };

  private botBehaviors: BotBehavior[] = [
    {
      name: "Maria_Artista",
      type: "ACTIVITY_BOT",
      avatar: "/avatars/maria.jpg",
      location: "Madrid, España",
      interests: ["Arte Contemporáneo", "Abstracto"],
      maxBids: 30,
      bidAmount: 1,
      frequency: 300, // 5 minutos
      responseProbability: 0.3
    },
    {
      name: "Carlos_Collector",
      type: "COMPETITIVE_BOT",
      avatar: "/avatars/carlos.jpg",
      location: "Barcelona, España",
      interests: ["Arte Clásico", "Impresionismo"],
      maxBids: 50,
      bidAmount: 2,
      frequency: 180, // 3 minutos
      responseProbability: 0.6
    },
    {
      name: "Ana_Gallery",
      type: "SPECIALIZED_BOT",
      avatar: "/avatars/ana.jpg",
      location: "Valencia, España",
      interests: ["Arte Emergente", "Fotografía"],
      maxBids: 25,
      bidAmount: 3,
      frequency: 240, // 4 minutos
      responseProbability: 0.4
    },
    {
      name: "LastChance",
      type: "URGENCY_BOT",
      avatar: "/avatars/lastchance.jpg",
      location: "España",
      interests: ["Todos"],
      maxBids: 20,
      bidAmount: 2,
      frequency: 120, // 2 minutos
      responseProbability: 0.8
    }
  ];

  // Inicializar bots en la base de datos
  async initializeBots() {
    console.log('🔄 Inicializando sistema de bots...');
    
    for (const behavior of this.botBehaviors) {
      const existingBot = await prisma.bot.findUnique({
        where: { name: behavior.name }
      });

      if (!existingBot) {
        await prisma.bot.create({
          data: {
            name: behavior.name,
            type: behavior.type,
            avatar: behavior.avatar,
            location: behavior.location,
            interests: behavior.interests,
            maxBids: behavior.maxBids,
            bidAmount: behavior.bidAmount,
            frequency: behavior.frequency,
            isActive: true
          }
        });
        console.log(`✅ Bot ${behavior.name} creado`);
      }
    }
  }

  // Obtener bots activos para una subasta específica
  async getActiveBotsForAuction(artworkId: string): Promise<any[]> {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { category: true }
    });

    if (!artwork) return [];

    const activeBots = await prisma.bot.findMany({
      where: { isActive: true }
    });

    // Filtrar bots por interés en la categoría
    const relevantBots = activeBots.filter(bot => 
      bot.interests.includes(artwork.category.name) || 
      bot.interests.includes("Todos")
    );

    // Limitar número de bots por subasta
    return relevantBots.slice(0, this.config.maxBotsPerAuction);
  }

  // Calcular probabilidad de respuesta del bot
  calculateResponseProbability(
    botType: BotType,
    timeLeft: number,
    currentBids: number,
    currentPrice: number,
    estimatedValue: number
  ): number {
    let baseProbability = 0.3;

    // Ajustar por tipo de bot
    switch (botType) {
      case "ACTIVITY_BOT":
        baseProbability = 0.3;
        break;
      case "COMPETITIVE_BOT":
        baseProbability = 0.6;
        break;
      case "URGENCY_BOT":
        baseProbability = 0.8;
        break;
      case "SPECIALIZED_BOT":
        baseProbability = 0.4;
        break;
    }

    // Ajustar por tiempo restante
    if (timeLeft < 600) { // Últimos 10 minutos
      baseProbability *= 1.5;
    } else if (timeLeft < 1800) { // Últimos 30 minutos
      baseProbability *= 1.2;
    }

    // Ajustar por actividad actual
    if (currentBids > 10) {
      baseProbability *= 1.3;
    }

    // Ajustar por precio vs valor estimado
    const priceRatio = currentPrice / estimatedValue;
    if (priceRatio < 0.5) {
      baseProbability *= 1.4; // Obra subvalorada
    } else if (priceRatio > 0.8) {
      baseProbability *= 0.6; // Obra sobrevalorada
    }

    return Math.min(baseProbability, 0.95); // Máximo 95%
  }

  // Determinar cantidad de tokens para pujar
  calculateBidAmount(
    botType: BotType,
    currentPrice: number,
    estimatedValue: number
  ): number {
    let baseAmount = 1;

    switch (botType) {
      case "ACTIVITY_BOT":
        baseAmount = 1;
        break;
      case "COMPETITIVE_BOT":
        baseAmount = Math.floor(Math.random() * 3) + 1; // 1-3 tokens
        break;
      case "URGENCY_BOT":
        baseAmount = Math.floor(Math.random() * 5) + 2; // 2-6 tokens
        break;
      case "SPECIALIZED_BOT":
        baseAmount = Math.floor(Math.random() * 4) + 2; // 2-5 tokens
        break;
    }

    // Ajustar por valor de la obra
    const priceRatio = currentPrice / estimatedValue;
    if (priceRatio < 0.3) {
      baseAmount = Math.min(baseAmount * 2, this.config.maxBidAmount);
    }

    return Math.min(baseAmount, this.config.maxBidAmount);
  }

  // Ejecutar acción de bot
  async executeBotAction(botId: string, artworkId: string, action: BotAction) {
    const bot = await prisma.bot.findUnique({
      where: { id: botId }
    });

    if (!bot || !bot.isActive) return;

    // Verificar límites diarios
    const todayBids = await prisma.botActivity.count({
      where: {
        botId,
        action: "BID",
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    if (todayBids >= bot.maxBids) {
      console.log(`🚫 Bot ${bot.name} alcanzó límite diario`);
      return;
    }

    // Verificar tiempo mínimo entre pujas
    const lastBid = await prisma.botActivity.findFirst({
      where: {
        botId,
        action: "BID",
        artworkId
      },
      orderBy: { createdAt: 'desc' }
    });

    if (lastBid) {
      const timeSinceLastBid = Date.now() - lastBid.createdAt.getTime();
      if (timeSinceLastBid < this.config.minTimeBetweenBids * 1000) {
        return;
      }
    }

    // Ejecutar acción
    switch (action) {
      case "BID":
        await this.executeBotBid(bot, artworkId);
        break;
      case "VIEW":
        await this.executeBotView(bot, artworkId);
        break;
      case "FAVORITE":
        await this.executeBotFavorite(bot, artworkId);
        break;
    }
  }

  // Ejecutar puja de bot
  private async executeBotBid(bot: any, artworkId: string) {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId }
    });

    if (!artwork || artwork.status !== "ACTIVE") return;

    const timeLeft = artwork.endDate.getTime() - Date.now();
    
    // Los bots no pujan en los últimos 5 minutos
    if (timeLeft < this.config.withdrawTime * 1000) {
      return;
    }

    // Calcular probabilidad de respuesta
    const currentBids = await prisma.bid.count({
      where: { artworkId }
    });

    const probability = this.calculateResponseProbability(
      bot.type as BotType,
      timeLeft,
      currentBids,
      artwork.currentPrice,
      artwork.estimatedValue
    );

    // Decidir si pujar basado en probabilidad
    if (Math.random() > probability) {
      return;
    }

    // Calcular cantidad de tokens
    const bidAmount = this.calculateBidAmount(
      bot.type as BotType,
      artwork.currentPrice,
      artwork.estimatedValue
    );

    // Crear puja de bot
    try {
      await prisma.bid.create({
        data: {
          amount: bidAmount,
          isBot: true,
          botType: bot.type as BotType,
          artworkId,
          userId: "bot-system", // ID especial para bots
          status: "ACTIVE"
        }
      });

      // Actualizar precio actual de la obra
      await prisma.artwork.update({
        where: { id: artworkId },
        data: {
          currentPrice: artwork.currentPrice + bidAmount,
          totalBids: artwork.totalBids + 1
        }
      });

      // Registrar actividad del bot
      await prisma.botActivity.create({
        data: {
          action: "BID",
          tokens: bidAmount,
          artworkId,
          botId: bot.id
        }
      });

      console.log(`🤖 Bot ${bot.name} pujó ${bidAmount} tokens en ${artwork.title}`);
    } catch (error) {
      console.error(`❌ Error en puja de bot ${bot.name}:`, error);
    }
  }

  // Ejecutar vista de bot
  private async executeBotView(bot: any, artworkId: string) {
    await prisma.botActivity.create({
      data: {
        action: "VIEW",
        tokens: 0,
        artworkId,
        botId: bot.id
      }
    });

    // Incrementar vistas de la obra
    await prisma.artwork.update({
      where: { id: artworkId },
      data: {
        views: { increment: 1 }
      }
    });
  }

  // Ejecutar favorito de bot
  private async executeBotFavorite(bot: any, artworkId: string) {
    await prisma.botActivity.create({
      data: {
        action: "FAVORITE",
        tokens: 0,
        artworkId,
        botId: bot.id
      }
    });

    // Incrementar favoritos de la obra
    await prisma.artwork.update({
      where: { id: artworkId },
      data: {
        favorites: { increment: 1 }
      }
    });
  }

  // Programar acciones de bots para una subasta
  async scheduleBotActions(artworkId: string) {
    const bots = await this.getActiveBotsForAuction(artworkId);
    
    for (const bot of bots) {
      // Programar pujas periódicas
      setInterval(async () => {
        await this.executeBotAction(bot.id, artworkId, "BID");
      }, bot.frequency * 1000);

      // Programar vistas ocasionales
      setInterval(async () => {
        if (Math.random() > 0.7) { // 30% de probabilidad
          await this.executeBotAction(bot.id, artworkId, "VIEW");
        }
      }, bot.frequency * 2 * 1000);

      // Programar favoritos ocasionales
      setInterval(async () => {
        if (Math.random() > 0.9) { // 10% de probabilidad
          await this.executeBotAction(bot.id, artworkId, "FAVORITE");
        }
      }, bot.frequency * 5 * 1000);
    }
  }

  // Obtener estadísticas de bots
  async getBotStatistics() {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    
    const stats = await prisma.botActivity.groupBy({
      by: ['action'],
      where: {
        createdAt: { gte: today }
      },
      _count: {
        id: true
      }
    });

    const botStats = await prisma.bot.groupBy({
      by: ['type'],
      _count: {
        id: true
      },
      where: {
        isActive: true
      }
    });

    return {
      todayActions: stats,
      activeBots: botStats,
      totalBots: await prisma.bot.count({ where: { isActive: true } })
    };
  }

  // Configurar parámetros del sistema
  async updateBotConfig(newConfig: Partial<BotConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Guardar en base de datos
    for (const [key, value] of Object.entries(this.config)) {
      await prisma.botConfig.upsert({
        where: { key },
        update: { value: value.toString() },
        create: {
          key,
          value: value.toString(),
          description: `Configuración del sistema de bots: ${key}`
        }
      });
    }
  }

  // Activar/desactivar bots
  async toggleBot(botId: string, isActive: boolean) {
    await prisma.bot.update({
      where: { id: botId },
      data: { isActive }
    });
  }

  // Obtener actividad reciente de bots
  async getRecentBotActivity(limit: number = 20) {
    return await prisma.botActivity.findMany({
      include: {
        bot: true,
        artwork: {
          select: {
            id: true,
            title: true,
            currentPrice: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}

// Instancia global del sistema de bots
export const botSystem = new BotSystem();

// Inicializar sistema al importar
botSystem.initializeBots().catch(console.error);
