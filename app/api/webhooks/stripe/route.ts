import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Simulación de webhook de Stripe
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error en webhook de Stripe:', error);
    return NextResponse.json(
      { error: 'Error en webhook' },
      { status: 400 }
    );
  }
}
