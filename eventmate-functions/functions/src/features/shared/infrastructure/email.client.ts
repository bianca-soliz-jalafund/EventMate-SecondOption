/* eslint-disable @typescript-eslint/no-explicit-any */
import * as nodemailer from 'nodemailer';

export interface EmailOptions<T = Record<string, unknown>> {
  to: string;
  subject: string;
  template: string;
  context: T;
}

export interface EventData {
  title: string;
  description: string;
  date: string;
  place: string;
  ownerName: string;
}

export class EmailClient {
  private transporter: nodemailer.Transporter | null = null;

  // Configuración de email hardcodeada para proyecto local
  private readonly EMAIL_CONFIG = {
    user: 'biancasoliz258@gmail.com',
    password: 'yqgq mjxn dqak bftb',
    from: 'EventMate <biancasoliz258@gmail.com>',
    appUrl: 'http://localhost:5173',
  };

  private async ensureTransporter(): Promise<void> {
    if (this.transporter) return;

    console.log('Using hardcoded email configuration for local development');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.EMAIL_CONFIG.user,
        pass: this.EMAIL_CONFIG.password,
      },
    });
  }

  async sendEmail<T = Record<string, unknown>>(
    options: EmailOptions<T>
  ): Promise<void> {
    try {
      await this.ensureTransporter();
      if (!this.transporter)
        throw new Error('Email transporter not initialized');

      // Crear HTML basado en el template
      let htmlContent = '';

      if (options.template === 'invitation') {
        htmlContent = this.createInvitationHTML(options.context as any);
      } else if (options.template === 'event-update') {
        htmlContent = this.createEventUpdateHTML(options.context as any);
      } else if (options.template === 'event-cancelled') {
        htmlContent = this.createEventCancelledHTML(options.context as any);
      }

      const mailOptions = {
        from: this.EMAIL_CONFIG.from,
        to: options.to,
        subject: options.subject,
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to: ${options.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${String(error)}`);
    }
  }

  private createInvitationHTML(context: any): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invitación al Evento</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              
              .header {
                  text-align: center;
                  border-bottom: 3px solid #007bff;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
              }
              
              .header h1 {
                  color: #007bff;
                  margin: 0;
                  font-size: 28px;
              }
              
              .content {
                  margin-bottom: 30px;
              }
              
              .event-details {
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  border-left: 4px solid #007bff;
                  margin: 20px 0;
              }
              
              .event-details h3 {
                  margin-top: 0;
                  color: #007bff;
              }
              
              .detail-item {
                  margin: 10px 0;
                  padding: 8px 0;
              }
              
              .detail-label {
                  font-weight: bold;
                  color: #555;
                  display: inline-block;
                  min-width: 80px;
              }
              
              .button {
                  display: inline-block;
                  background-color: #007bff;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                  text-align: center;
                  font-weight: bold;
              }
              
              .button:hover {
                  background-color: #0056b3;
              }
              
              .footer {
                  text-align: center;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                  color: #666;
                  font-size: 14px;
              }
              
              .success {
                  background-color: #d4edda;
                  border: 1px solid #c3e6cb;
                  color: #155724;
                  padding: 15px;
                  border-radius: 5px;
                  margin: 15px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>EventApp</h1>
              </div>
              
              <div class="content">
                  <h2>¡Has sido invitado a un evento!</h2>
                  
                  <p>Hola,</p>
                  
                  <p><strong>${context.ownerName}</strong> te ha invitado a participar en un evento increíble. Para poder acceder y gestionar tu invitación, necesitas registrarte en nuestra plataforma.</p>
                  
                  <div class="event-details">
                      <h3>📅 Detalles del Evento</h3>
                      
                      <div class="detail-item">
                          <span class="detail-label">Título:</span>
                          <strong>${context.eventTitle}</strong>
                      </div>
                      
                      <div class="detail-item">
                          <span class="detail-label">Fecha:</span>
                          ${context.eventDate}
                      </div>
                      
                      <div class="detail-item">
                          <span class="detail-label">Lugar:</span>
                          ${context.eventPlace}
                      </div>
                      
                      ${
                        context.eventDescription
                          ? `
                      <div class="detail-item">
                          <span class="detail-label">Descripción:</span>
                          <p style="margin: 10px 0;">${context.eventDescription}</p>
                      </div>
                      `
                          : ''
                      }
                      
                      <div class="detail-item">
                          <span class="detail-label">Organizador:</span>
                          ${context.ownerName}
                      </div>
                  </div>
                  
                  <div class="success">
                      <strong>¡No te pierdas esta oportunidad!</strong>
                      <p>Regístrate ahora para confirmar tu asistencia y recibir todas las actualizaciones del evento.</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${context.registerUrl}" class="button">Registrarme Ahora</a>
                  </div>
                  
                  <p>Una vez registrado, podrás:</p>
                  <ul>
                      <li>✅ Confirmar tu asistencia al evento</li>
                      <li>🔔 Recibir notificaciones sobre cambios</li>
                      <li>👥 Ver otros asistentes</li>
                      <li>📱 Acceder a toda la información desde tu perfil</li>
                  </ul>
                  
                  <p>Si tienes alguna pregunta sobre este evento, puedes contactar directamente con <strong>${context.ownerName}</strong>.</p>
                  
                  <p>¡Esperamos verte pronto en nuestra plataforma!</p>
                  
                  <p>Saludos,<br>
                  <strong>El equipo de EventApp</strong></p>
              </div>
              
              <div class="footer">
                  <p>Este email fue enviado automáticamente por EventApp.</p>
                  <p>Si no deseas recibir más notificaciones, puedes deshabilitarlas en tu perfil.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  private createEventUpdateHTML(context: any): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Actualización del Evento</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              
              .header {
                  text-align: center;
                  border-bottom: 3px solid #007bff;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
              }
              
              .header h1 {
                  color: #007bff;
                  margin: 0;
                  font-size: 28px;
              }
              
              .content {
                  margin-bottom: 30px;
              }
              
              .event-details {
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  border-left: 4px solid #007bff;
                  margin: 20px 0;
              }
              
              .event-details h3 {
                  margin-top: 0;
                  color: #007bff;
              }
              
              .detail-item {
                  margin: 10px 0;
                  padding: 8px 0;
              }
              
              .detail-label {
                  font-weight: bold;
                  color: #555;
                  display: inline-block;
                  min-width: 80px;
              }
              
              .button {
                  display: inline-block;
                  background-color: #007bff;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                  text-align: center;
                  font-weight: bold;
              }
              
              .button:hover {
                  background-color: #0056b3;
              }
              
              .footer {
                  text-align: center;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                  color: #666;
                  font-size: 14px;
              }
              
              .warning {
                  background-color: #fff3cd;
                  border: 1px solid #ffeaa7;
                  color: #856404;
                  padding: 15px;
                  border-radius: 5px;
                  margin: 15px 0;
              }
              
              .success {
                  background-color: #d4edda;
                  border: 1px solid #c3e6cb;
                  color: #155724;
                  padding: 15px;
                  border-radius: 5px;
                  margin: 15px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>EventApp</h1>
              </div>
              
              <div class="content">
                  <h2>📢 Actualización del Evento</h2>
                  
                  <p>Hola,</p>
                  
                  <p>Te informamos que el evento <strong>${context.eventTitle}</strong> al que estás invitado ha sido actualizado por <strong>${context.ownerName}</strong>.</p>
                  
                  <div class="warning">
                      <strong>⚠️ Información Actualizada</strong>
                      <p>Por favor, revisa los nuevos detalles del evento para asegurarte de tener la información más reciente.</p>
                  </div>
                  
                  <div class="event-details">
                      <h3>📅 Nuevos Detalles del Evento</h3>
                      
                      <div class="detail-item">
                          <span class="detail-label">Título:</span>
                          <strong>${context.eventTitle}</strong>
                      </div>
                      
                      <div class="detail-item">
                          <span class="detail-label">Fecha:</span>
                          <strong>${context.eventDate}</strong>
                      </div>
                      
                      <div class="detail-item">
                          <span class="detail-label">Lugar:</span>
                          <strong>${context.eventPlace}</strong>
                      </div>
                      
                      ${
                        context.eventDescription
                          ? `
                      <div class="detail-item">
                          <span class="detail-label">Descripción:</span>
                          <p style="margin: 10px 0;">${context.eventDescription}</p>
                      </div>
                      `
                          : ''
                      }
                      
                      <div class="detail-item">
                          <span class="detail-label">Organizador:</span>
                          ${context.ownerName}
                      </div>
                  </div>
                  
                  <div class="success">
                      <strong>¿Qué hacer ahora?</strong>
                      <ul style="margin: 10px 0; padding-left: 20px;">
                          <li>Revisa si la nueva fecha y hora te convienen</li>
                          <li>Anota el nuevo lugar en tu calendario</li>
                          <li>Confirma tu asistencia si aún no lo has hecho</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="#" class="button">Ver Evento Completo</a>
                  </div>
                  
                  <p><strong>Importante:</strong> Si no puedes asistir con los nuevos detalles, puedes actualizar tu respuesta en cualquier momento desde tu perfil.</p>
                  
                  <p>Si tienes alguna pregunta sobre estos cambios, no dudes en contactar con <strong>${context.ownerName}</strong>.</p>
                  
                  <p>Gracias por tu comprensión.</p>
                  
                  <p>Saludos,<br>
                  <strong>El equipo de EventApp</strong></p>
              </div>
              
              <div class="footer">
                  <p>Este email fue enviado automáticamente por EventApp.</p>
                  <p>Si no deseas recibir más notificaciones, puedes deshabilitarlas en tu perfil.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  private createEventCancelledHTML(context: any): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Evento Cancelado</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              
              .header {
                  text-align: center;
                  border-bottom: 3px solid #007bff;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
              }
              
              .header h1 {
                  color: #007bff;
                  margin: 0;
                  font-size: 28px;
              }
              
              .content {
                  margin-bottom: 30px;
              }
              
              .event-details {
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  border-left: 4px solid #007bff;
                  margin: 20px 0;
              }
              
              .event-details h3 {
                  margin-top: 0;
                  color: #007bff;
              }
              
              .detail-item {
                  margin: 10px 0;
                  padding: 8px 0;
              }
              
              .detail-label {
                  font-weight: bold;
                  color: #555;
                  display: inline-block;
                  min-width: 80px;
              }
              
              .button {
                  display: inline-block;
                  background-color: #6c757d;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                  text-align: center;
                  font-weight: bold;
              }
              
              .button:hover {
                  background-color: #5a6268;
              }
              
              .footer {
                  text-align: center;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                  color: #666;
                  font-size: 14px;
              }
              
              .warning {
                  background-color: #fff3cd;
                  border: 1px solid #ffeaa7;
                  color: #856404;
                  padding: 15px;
                  border-radius: 5px;
                  margin: 15px 0;
              }
              
              .danger {
                  background-color: #f8d7da;
                  border: 1px solid #f5c6cb;
                  color: #721c24;
                  padding: 15px;
                  border-radius: 5px;
                  margin: 15px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>EventApp</h1>
              </div>
              
              <div class="content">
                  <h2>❌ Evento Cancelado</h2>
                  
                  <p>Hola,</p>
                  
                  <p>Lamentamos informarte que el evento <strong>${context.eventTitle}</strong> ha sido <strong>cancelado</strong> por <strong>${context.ownerName}</strong>.</p>
                  
                  <div class="danger">
                      <strong>🚫 Evento Cancelado</strong>
                      <p>Este evento ya no se realizará. Te pedimos disculpas por cualquier inconveniente que esto pueda causarte.</p>
                  </div>
                  
                  <div class="event-details">
                      <h3>📅 Detalles del Evento Cancelado</h3>
                      
                      <div class="detail-item">
                          <span class="detail-label">Título:</span>
                          <strong>${context.eventTitle}</strong>
                      </div>
                      
                      <div class="detail-item">
                          <span class="detail-label">Fecha:</span>
                          <strike>${context.eventDate}</strike>
                      </div>
                      
                      <div class="detail-item">
                          <span class="detail-label">Lugar:</span>
                          <strike>${context.eventPlace}</strike>
                      </div>
                      
                      ${
                        context.eventDescription
                          ? `
                      <div class="detail-item">
                          <span class="detail-label">Descripción:</span>
                          <p style="margin: 10px 0; opacity: 0.7;"><strike>${context.eventDescription}</strike></p>
                      </div>
                      `
                          : ''
                      }
                      
                      <div class="detail-item">
                          <span class="detail-label">Organizador:</span>
                          ${context.ownerName}
                      </div>
                  </div>
                  
                  <div class="warning">
                      <strong>📝 Acciones Recomendadas</strong>
                      <ul style="margin: 10px 0; padding-left: 20px;">
                          <li>Elimina este evento de tu calendario personal</li>
                          <li>Si habías hecho planes relacionados, ajústalos según sea necesario</li>
                          <li>Mantente atento por si el organizador programa un evento alternativo</li>
                      </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="#" class="button">Ver Otros Eventos</a>
                  </div>
                  
                  <p><strong>¿Por qué recibí este email?</strong></p>
                  <p>Recibiste esta notificación porque estabas invitado a este evento. Queremos asegurarnos de que tengas la información más actualizada.</p>
                  
                  <p>Si tienes alguna pregunta sobre la cancelación, puedes contactar directamente con <strong>${context.ownerName}</strong>.</p>
                  
                  <p>Esperamos poder verte en futuros eventos.</p>
                  
                  <p>Saludos,<br>
                  <strong>El equipo de EventApp</strong></p>
              </div>
              
              <div class="footer">
                  <p>Este email fue enviado automáticamente por EventApp.</p>
                  <p>Si no deseas recibir más notificaciones, puedes deshabilitarlas en tu perfil.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  async sendInvitationEmail(to: string, eventData: EventData): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Invitación al evento: ${eventData.title}`,
      template: 'invitation',
      context: {
        eventTitle: eventData.title,
        eventDescription: eventData.description,
        eventDate: eventData.date,
        eventPlace: eventData.place,
        ownerName: eventData.ownerName,
        registerUrl: `${this.EMAIL_CONFIG.appUrl}/register`,
      },
    });
  }

  async sendEventUpdateEmail(
    to: string,
    eventData: EventData,
    changeType: 'updated' | 'cancelled'
  ): Promise<void> {
    const template =
      changeType === 'cancelled' ? 'event-cancelled' : 'event-update';
    const subject =
      changeType === 'cancelled'
        ? `Evento cancelado: ${eventData.title}`
        : `Actualización del evento: ${eventData.title}`;

    await this.sendEmail({
      to,
      subject,
      template,
      context: {
        eventTitle: eventData.title,
        eventDescription: eventData.description,
        eventDate: eventData.date,
        eventPlace: eventData.place,
        ownerName: eventData.ownerName,
        changeType,
      },
    });
  }
}

export const emailClient = new EmailClient();
