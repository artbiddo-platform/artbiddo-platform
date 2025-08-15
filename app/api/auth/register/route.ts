import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EmailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, address } = await request.json();

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        role: 'BUYER', // Por defecto es comprador
        tokens: 0,
        balance: 0,
        verified: false
      }
    });

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Enviar email de bienvenida (en segundo plano)
    try {
      await EmailService.sendWelcomeEmail({
        to: user.email,
        name: user.name
      });
    } catch (error) {
      console.error('Error enviando email de bienvenida:', error);
      // No fallamos el registro si el email falla
    }

    // Preparar datos del usuario para el frontend
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      tokens: user.tokens,
      balance: user.balance,
      verified: user.verified
    };

    return NextResponse.json({
      success: true,
      token,
      user: userData,
      message: 'Usuario registrado exitosamente'
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
