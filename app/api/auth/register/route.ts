import { NextRequest, NextResponse } from 'next/server';

// Usuarios mock para testing (en producción esto estaría en la base de datos)
let mockUsers = [
  {
    id: '1',
    name: 'Admin ArtBiddo',
    email: 'admin@artbiddo.com',
    password: 'admin123456',
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
    const { name, email, password, role, phone, address } = await request.json();

    // Validaciones básicas
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = mockUsers.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 400 }
      );
    }

    // Crear el usuario
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      password, // En producción esto estaría hasheado
      role: role.toUpperCase(),
      phone: phone || '',
      address: address || '',
      balance: 0
    };

    // Agregar a la lista mock (en producción esto iría a la base de datos)
    mockUsers.push(newUser);

    // Generar token mock
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    // Retornar respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
