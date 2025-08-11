import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// PUT - Actualizar contenido
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;

    let result;

    switch (type) {
      case 'pageContent':
        result = await prisma.pageContent.update({
          where: { id },
          data: {
            page: data.page,
            section: data.section,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            content: data.content,
            image: data.image,
            link: data.link,
            order: data.order,
            isActive: data.isActive
          }
        });
        break;

      case 'siteSettings':
        result = await prisma.siteSettings.update({
          where: { id },
          data: {
            key: data.key,
            value: data.value,
            type: data.type,
            description: data.description,
            isPublic: data.isPublic
          }
        });
        break;

      case 'contentBlock':
        result = await prisma.contentBlock.update({
          where: { id },
          data: {
            name: data.name,
            title: data.title,
            content: data.content,
            type: data.type,
            metadata: data.metadata,
            isActive: data.isActive
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
      message: 'Contenido actualizado exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar contenido
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { type } = await request.json();
    const { id } = params;

    let result;

    switch (type) {
      case 'pageContent':
        result = await prisma.pageContent.delete({
          where: { id }
        });
        break;

      case 'siteSettings':
        result = await prisma.siteSettings.delete({
          where: { id }
        });
        break;

      case 'contentBlock':
        result = await prisma.contentBlock.delete({
          where: { id }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de contenido no válido' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: 'Contenido eliminado exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error al eliminar contenido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
