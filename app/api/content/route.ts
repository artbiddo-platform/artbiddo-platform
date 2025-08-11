import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener contenido público
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url || '');
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const block = searchParams.get('block');

    // Si se solicita un bloque específico
    if (block) {
      const contentBlock = await prisma.contentBlock.findUnique({
        where: { name: block, isActive: true }
      });

      if (!contentBlock) {
        return NextResponse.json(
          { error: 'Bloque de contenido no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({ content: contentBlock });
    }

    // Si se solicita contenido de una página específica
    if (page) {
      const whereClause: any = { page, isActive: true };
      if (section) {
        whereClause.section = section;
      }

      const pageContent = await prisma.pageContent.findMany({
        where: whereClause,
        orderBy: { order: 'asc' }
      });

      return NextResponse.json({ content: pageContent });
    }

    // Obtener configuraciones públicas del sitio
    const siteSettings = await prisma.siteSettings.findMany({
      where: { isPublic: true },
      orderBy: { key: 'asc' }
    });

    // Obtener bloques de contenido activos
    const contentBlocks = await prisma.contentBlock.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      siteSettings,
      contentBlocks
    });

  } catch (error) {
    console.error('Error al obtener contenido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
