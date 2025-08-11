import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artworkId, winnerId, amount } = body;

    // Simulación de procesamiento de comisión
    const commission = amount * 0.05;
    const sellerAmount = amount - commission;

    return NextResponse.json({
      success: true,
      transferId: 'simulated_transfer_id',
      commission,
      sellerAmount
    });

  } catch (error) {
    console.error('Error procesando comisión:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
