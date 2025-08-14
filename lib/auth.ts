import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { NextRequest } from 'next/server';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'BUYER' | 'SELLER';
  phone?: string;
  address?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

// Verificar token JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Error verificando token:', error);
    return null;
  }
}

// Extraer token del header Authorization
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Verificar si el usuario es administrador
export function isAdmin(payload: JWTPayload): boolean {
  return payload.role === 'ADMIN';
}

// Middleware para proteger rutas de admin
export function requireAdmin(payload: JWTPayload): boolean {
  if (!payload || !isAdmin(payload)) {
    return false;
  }
  return true;
}

// Middleware para proteger rutas de usuario
export function requireAuth(payload: JWTPayload): boolean {
  return !!payload;
}

export const authenticateUser = async (credentials: LoginCredentials) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });

  if (!user) return null;

  const isValid = await verifyPassword(credentials.password, user.password);
  if (!isValid) return null;

  return user;
};

export const registerUser = async (data: RegisterData) => {
  const hashedPassword = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
      address: data.address,
    }
  });

  return user;
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

export const updateUserBalance = async (userId: string, amount: number) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: amount } }
  });
};

export const createNotification = async (userId: string, type: string, title: string, message: string) => {
  return await prisma.notification.create({
    data: {
      userId,
      type: type as any,
      title,
      message
    }
  });
};

export const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true }
  });
};
