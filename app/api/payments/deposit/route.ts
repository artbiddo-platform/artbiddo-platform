import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    // Validar monto
    if (amount < 10 || amount > 10000) {
      return NextResponse.json(
        { error: 'El monto debe estar entre €10 y €10,000' },
        { status: 400 }
      );
    }

    // Simulación de sesión de pago
    const sessionId = `simulated_session_${Date.now()}`;
    const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/perfil?payment=success&session_id=${sessionId}`;

    return NextResponse.json({
      sessionId,
      url
    });

  } catch (error) {
    console.error('Error al crear sesión de pago:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
