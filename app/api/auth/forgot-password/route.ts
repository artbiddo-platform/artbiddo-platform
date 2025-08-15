import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/emailService';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
      });
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Enviar email de reset
    try {
      await EmailService.sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetToken
      });
    } catch (error) {
      console.error('Error enviando email de reset:', error);
      return NextResponse.json(
        { error: 'Error enviando email de reset' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
    });

  } catch (error) {
    console.error('Error en forgot password:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
