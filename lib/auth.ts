import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

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

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch {
    return null;
  }
};

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
