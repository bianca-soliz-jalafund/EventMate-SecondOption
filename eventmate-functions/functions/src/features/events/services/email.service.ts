import { emailClient } from '../../shared/infrastructure/email.client';
import { Logger } from '../../shared/utils/logger';
import Event from '../models/event.model';
import UserConfiguration from '../models/user-configuration.model';

export class EmailService {
  /**
   * Envía email de invitación a registrarse
   */
  async sendRegistrationInvitation(email: string, event: Event): Promise<void> {
    try {
      Logger.info('Sending registration invitation', {
        email,
        eventId: event.id,
      });

      await emailClient.sendInvitationEmail(email, {
        title: event.title,
        description: event.description,
        date: this.formatDate(event.date),
        place: event.place,
        ownerName: event.ownerName,
      });

      Logger.info('Registration invitation sent successfully', {
        email,
        eventId: event.id,
      });
    } catch (error) {
      Logger.error('Error sending registration invitation', {
        email,
        eventId: event.id,
        error,
      });
      throw new Error(`Failed to send invitation email: ${error}`);
    }
  }

  /**
   * Envía notificación de cambio en evento
   */
  async sendEventChangeNotification(
    users: UserConfiguration[],
    event: Event,
    changeType: 'updated' | 'cancelled'
  ): Promise<void> {
    try {
      Logger.info('Sending event change notifications', {
        eventId: event.id,
        changeType,
        userCount: users.length,
      });

      const emailPromises = users.map((user) =>
        this.sendEventChangeToUser(user.email, event, changeType)
      );

      await Promise.allSettled(emailPromises);

      Logger.info('Event change notifications sent', {
        eventId: event.id,
        changeType,
        userCount: users.length,
      });
    } catch (error) {
      Logger.error('Error sending event change notifications', {
        eventId: event.id,
        changeType,
        error,
      });
      throw new Error(`Failed to send change notifications: ${error}`);
    }
  }

  /**
   * Envía notificación a un usuario específico
   */
  private async sendEventChangeToUser(
    email: string,
    event: Event,
    changeType: 'updated' | 'cancelled'
  ): Promise<void> {
    try {
      await emailClient.sendEventUpdateEmail(
        email,
        {
          title: event.title,
          description: event.description,
          date: this.formatDate(event.date),
          place: event.place,
          ownerName: event.ownerName,
        },
        changeType
      );

      Logger.info('Event change notification sent to user', {
        email,
        eventId: event.id,
        changeType,
      });
    } catch (error) {
      Logger.error('Error sending event change to user', {
        email,
        eventId: event.id,
        changeType,
        error,
      });
    }
  }

  /**
   * Envía notificación masiva a invitados
   */
  async sendNotificationToInvitees(
    inviteeEmails: string[],
    event: Event,
    changeType: 'updated' | 'cancelled'
  ): Promise<void> {
    try {
      Logger.info('Sending notifications to invitees', {
        eventId: event.id,
        changeType,
        inviteeCount: inviteeEmails.length,
      });

      const emailPromises = inviteeEmails.map((email) =>
        this.sendEventChangeToUser(email, event, changeType)
      );

      const results = await Promise.allSettled(emailPromises);

      const successful = results.filter(
        (result) => result.status === 'fulfilled'
      ).length;
      const failed = results.filter(
        (result) => result.status === 'rejected'
      ).length;

      Logger.info('Notifications to invitees completed', {
        eventId: event.id,
        successful,
        failed,
        total: inviteeEmails.length,
      });
    } catch (error) {
      Logger.error('Error sending notifications to invitees', {
        eventId: event.id,
        changeType,
        error,
      });
      throw new Error(`Failed to send notifications to invitees: ${error}`);
    }
  }

  /**
   * Formatea una fecha para mostrar en emails
   */
  private formatDate(date: Date): string {
    try {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      Logger.warn('Error formatting date, using fallback', { date, error });
      return date.toString();
    }
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Envía email con validación previa
   */
  async sendEmailWithValidation<T>(
    email: string,
    subject: string,
    template: string,
    context: T
  ): Promise<void> {
    if (!this.isValidEmail(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    try {
      await emailClient.sendEmail({
        to: email,
        subject,
        template,
        context,
      });
    } catch (error) {
      Logger.error('Error sending email with validation', {
        email,
        template,
        error,
      });
      throw error;
    }
  }
}
