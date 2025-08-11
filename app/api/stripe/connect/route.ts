import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Simulación de conexión con Stripe
    return NextResponse.json({
      success: true,
      accountId: 'simulated_stripe_account_id',
      url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/perfil?stripe=connected`
    });

  } catch (error) {
    console.error('Error al conectar con Stripe:', error);
    return NextResponse.json(
      { error: 'Error al conectar con Stripe' },
      { status: 500 }
    );
  }
}
