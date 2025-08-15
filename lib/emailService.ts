import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  name: string;
  [key: string]: any;
}

export class EmailService {
  // Email de bienvenida al registrarse
  static async sendWelcomeEmail(data: EmailData) {
    try {
      const { data: result, error } = await resend.emails.send({
        from: 'ArtBiddo <noreply@artbiddo.es>',
        to: [data.to],
        subject: '¡Bienvenido a ArtBiddo! 🎨',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">ARTBIDDO</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Subastas de Arte Contemporáneo</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">¡Bienvenido, ${data.name}! 🎉</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Gracias por unirte a ArtBiddo, la plataforma líder en subastas de arte contemporáneo. 
                Ya puedes comenzar a explorar obras únicas y participar en emocionantes subastas.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">¿Qué puedes hacer ahora?</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>✨ Explorar subastas activas</li>
                  <li>💎 Comprar tokens para pujar</li>
                  <li>🎨 Descubrir artistas emergentes</li>
                  <li>📱 Configurar tu perfil</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'https://artbiddo.es'}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  Comenzar a Explorar
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                Si tienes alguna pregunta, no dudes en contactarnos en <a href="mailto:info@artbiddo.com" style="color: #667eea;">info@artbiddo.com</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              © 2024 ArtBiddo. Todos los derechos reservados.
            </div>
          </div>
        `
      });

      if (error) {
        console.error('Error enviando email de bienvenida:', error);
        return false;
      }

      console.log('Email de bienvenida enviado:', result);
      return true;
    } catch (error) {
      console.error('Error en sendWelcomeEmail:', error);
      return false;
    }
  }

  // Email para cambiar contraseña
  static async sendPasswordResetEmail(data: EmailData & { resetToken: string }) {
    try {
      const resetUrl = `${process.env.NEXTAUTH_URL || 'https://artbiddo.es'}/reset-password?token=${data.resetToken}`;
      
      const { data: result, error } = await resend.emails.send({
        from: 'ArtBiddo <noreply@artbiddo.es>',
        to: [data.to],
        subject: 'Restablecer tu contraseña - ArtBiddo 🔐',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">ARTBIDDO</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Subastas de Arte Contemporáneo</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Hola, ${data.name} 🔐</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Has solicitado restablecer tu contraseña en ArtBiddo. 
                Haz clic en el botón de abajo para crear una nueva contraseña segura.
              </p>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  ⚠️ Este enlace expirará en 1 hora por seguridad.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  Restablecer Contraseña
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Si no solicitaste este cambio, puedes ignorar este email. 
                Tu contraseña actual seguirá siendo válida.
              </p>
              
              <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                ¿Necesitas ayuda? Contacta con <a href="mailto:soporte@artbiddo.com" style="color: #667eea;">soporte@artbiddo.com</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              © 2024 ArtBiddo. Todos los derechos reservados.
            </div>
          </div>
        `
      });

      if (error) {
        console.error('Error enviando email de reset:', error);
        return false;
      }

      console.log('Email de reset enviado:', result);
      return true;
    } catch (error) {
      console.error('Error en sendPasswordResetEmail:', error);
      return false;
    }
  }

  // Email de confirmación de compra
  static async sendPurchaseConfirmationEmail(data: EmailData & { 
    purchaseDetails: {
      itemName: string;
      amount: number;
      transactionId: string;
      purchaseDate: string;
    }
  }) {
    try {
      const { data: result, error } = await resend.emails.send({
        from: 'ArtBiddo <noreply@artbiddo.es>',
        to: [data.to],
        subject: 'Confirmación de Compra - ArtBiddo 🎨',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">ARTBIDDO</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Subastas de Arte Contemporáneo</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">¡Gracias por tu compra, ${data.name}! 🎉</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Tu compra ha sido procesada exitosamente. Aquí tienes los detalles de tu transacción:
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Detalles de la Compra</h3>
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                  <span style="color: #666;">Producto:</span>
                  <span style="color: #333; font-weight: bold;">${data.purchaseDetails.itemName}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                  <span style="color: #666;">Monto:</span>
                  <span style="color: #333; font-weight: bold;">€${data.purchaseDetails.amount.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                  <span style="color: #666;">ID Transacción:</span>
                  <span style="color: #333; font-weight: bold;">${data.purchaseDetails.transactionId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                  <span style="color: #666;">Fecha:</span>
                  <span style="color: #333; font-weight: bold;">${data.purchaseDetails.purchaseDate}</span>
                </div>
              </div>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #155724; margin: 0; font-size: 14px;">
                  ✅ Tu compra ha sido confirmada y procesada correctamente.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'https://artbiddo.es'}/perfil" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  Ver Mi Perfil
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                ¿Tienes preguntas sobre tu compra? Contacta con <a href="mailto:soporte@artbiddo.com" style="color: #667eea;">soporte@artbiddo.com</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              © 2024 ArtBiddo. Todos los derechos reservados.
            </div>
          </div>
        `
      });

      if (error) {
        console.error('Error enviando email de compra:', error);
        return false;
      }

      console.log('Email de compra enviado:', result);
      return true;
    } catch (error) {
      console.error('Error en sendPurchaseConfirmationEmail:', error);
      return false;
    }
  }
}
