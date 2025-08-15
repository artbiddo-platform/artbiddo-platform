import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { 
      userEmail, 
      userName, 
      itemName, 
      amount, 
      transactionId 
    } = await request.json();

    if (!userEmail || !userName || !itemName || !amount || !transactionId) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Enviar email de confirmación de compra
    const success = await EmailService.sendPurchaseConfirmationEmail({
      to: userEmail,
      name: userName,
      purchaseDetails: {
        itemName,
        amount: parseFloat(amount),
        transactionId,
        purchaseDate: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Error enviando email de confirmación' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email de confirmación enviado exitosamente'
    });

  } catch (error) {
    console.error('Error enviando email de compra:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
