import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url || '');
    const artworkId = searchParams.get('artworkId');

    if (!artworkId) {
      return NextResponse.json(
        { error: 'ID de obra requerido' },
        { status: 400 }
      );
    }

    const bids = await prisma.bid.findMany({
      where: { artworkId },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ bids });

  } catch (error) {
    console.error('Error al obtener pujas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { artworkId, amount } = await request.json();

    // Verificar token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Validaciones básicas
    if (!artworkId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Datos de puja inválidos' },
        { status: 400 }
      );
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener obra de arte
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId }
    });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Obra de arte no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que la subasta esté activa
    if (artwork.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Esta subasta no está activa' },
        { status: 400 }
      );
    }

    // Verificar que no haya expirado
    if (new Date() > artwork.endDate) {
      return NextResponse.json(
        { error: 'Esta subasta ha expirado' },
        { status: 400 }
      );
    }

    // Verificar que la puja sea mayor al precio actual
    if (amount <= artwork.currentPrice) {
      return NextResponse.json(
        { error: `La puja debe ser mayor a €${artwork.currentPrice.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Verificar saldo del usuario
    if (amount > user.balance) {
      return NextResponse.json(
        { error: 'Saldo insuficiente' },
        { status: 400 }
      );
    }

    // Crear la puja en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear la nueva puja
      const newBid = await tx.bid.create({
        data: {
          artworkId,
          userId: user.id,
          amount,
          status: 'ACTIVE'
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      });

      // Actualizar precio actual de la obra
      await tx.artwork.update({
        where: { id: artworkId },
        data: { currentPrice: amount }
      });

      // Descontar saldo del usuario
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } }
      });

      // Marcar pujas anteriores como superadas
      await tx.bid.updateMany({
        where: {
          artworkId,
          userId: { not: user.id },
          status: 'ACTIVE'
        },
        data: { status: 'OUTBID' }
      });

      // Devolver saldo a usuarios superados
      const outbidBids = await tx.bid.findMany({
        where: {
          artworkId,
          status: 'OUTBID',
          userId: { not: user.id }
        },
        include: { user: true }
      });

      for (const bid of outbidBids) {
        await tx.user.update({
          where: { id: bid.userId },
          data: { balance: { increment: bid.amount } }
        });
      }

      return newBid;
    });

    return NextResponse.json({
      message: 'Puja realizada exitosamente',
      bid: result
    });

  } catch (error) {
    console.error('Error al crear puja:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
