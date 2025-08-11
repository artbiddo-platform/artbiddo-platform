import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            name: true
          }
        },
        seller: {
          select: {
            name: true
          }
        }
      }
    });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Obra no encontrada' },
        { status: 404 }
      );
    }

    // Incrementar vistas
    await prisma.artwork.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({ artwork });

  } catch (error) {
    console.error('Error al obtener obra:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
