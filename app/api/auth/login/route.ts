import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Credenciales de administrador (en producción deberían estar en variables de entorno)
const ADMIN_EMAIL = 'admin@artbiddo.com';
const ADMIN_PASSWORD = 'ArtBiddo2024!';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si es el administrador
    if (email === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        // Crear token JWT para admin
        const token = jwt.sign(
          { 
            userId: 'admin-1', 
            email: ADMIN_EMAIL, 
            role: 'ADMIN' 
          },
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        );

        const adminUser = {
          id: 'admin-1',
          email: ADMIN_EMAIL,
          name: 'Administrador ArtBiddo',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          tokens: 999999, // Tokens ilimitados para admin
          balance: 999999
        };

        return NextResponse.json({
          success: true,
          token,
          user: adminUser,
          message: 'Login exitoso como administrador'
        });
      } else {
        return NextResponse.json(
          { error: 'Credenciales de administrador incorrectas' },
          { status: 401 }
        );
      }
    }

    // Buscar usuario normal en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

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

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

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
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
