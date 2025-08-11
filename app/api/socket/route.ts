import { NextRequest, NextResponse } from 'next/server';
import { initSocket } from '@/lib/socket';

export async function GET(request: NextRequest) {
  try {
    // Para App Router, simplemente retornamos un mensaje de éxito
    // La inicialización del socket se maneja de otra manera
    return NextResponse.json({ message: 'Socket server ready' });
  } catch (error) {
    console.error('Error with socket route:', error);
    return NextResponse.json(
      { message: 'Error with socket server' },
      { status: 500 }
    );
  }
}
