import { NextRequest, NextResponse } from 'next/server';

// Usuarios mock para testing
const mockUsers = [
  {
    id: '1',
    name: 'Admin ArtBiddo',
    email: 'admin@artbiddo.com',
    password: 'admin123456', // En producción esto estaría hasheado
    role: 'ADMIN',
    phone: '+34 91 123 4567',
    address: 'Madrid, España',
    balance: 10000
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    password: 'password123',
    role: 'SELLER',
    phone: '+34 91 234 5678',
    address: 'Barcelona, España',
    balance: 5000
  },
  {
    id: '3',
    name: 'Ana López',
    email: 'ana.lopez@email.com',
    password: 'password123',
    role: 'BUYER',
    phone: '+34 91 345 6789',
    address: 'Valencia, España',
    balance: 3000
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario en mock data
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña (en producción esto sería hasheado)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token mock
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Retornar respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
