import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - Obtener todo el contenido
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación de admin
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

    // Verificar que sea admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Obtener todo el contenido
    const [pageContent, siteSettings, contentBlocks] = await Promise.all([
      prisma.pageContent.findMany({
        orderBy: [{ page: 'asc' }, { order: 'asc' }]
      }),
      prisma.siteSettings.findMany({
        orderBy: { key: 'asc' }
      }),
      prisma.contentBlock.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    return NextResponse.json({
      pageContent,
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

// POST - Crear nuevo contenido
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación de admin
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

    // Verificar que sea admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const { type, data } = await request.json();

    let result;

    switch (type) {
      case 'pageContent':
        result = await prisma.pageContent.create({
          data: {
            page: data.page,
            section: data.section,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            content: data.content,
            image: data.image,
            link: data.link,
            order: data.order || 0
          }
        });
        break;

      case 'siteSettings':
        result = await prisma.siteSettings.create({
          data: {
            key: data.key,
            value: data.value,
            type: data.type || 'text',
            description: data.description,
            isPublic: data.isPublic || false
          }
        });
        break;

      case 'contentBlock':
        result = await prisma.contentBlock.create({
          data: {
            name: data.name,
            title: data.title,
            content: data.content,
            type: data.type || 'TEXT',
            metadata: data.metadata
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de contenido no válido' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: 'Contenido creado exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error al crear contenido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
