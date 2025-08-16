import { firestoreClient } from '../../shared/infrastructure/firestore.client';
import { notificationClient } from '../../shared/infrastructure/notification.client';
import { Logger } from '../../shared/utils/logger';
import Event from '../models/event.model';

export class NotificationService {
  async getDeviceTokensFromEmails(inviteeEmails: string[]): Promise<string[]> {
    try {
      if (!Array.isArray(inviteeEmails) || inviteeEmails.length === 0)
        return [];

      const tokens: string[] = [];
      const batchSize = 10;
      for (let i = 0; i < inviteeEmails.length; i += batchSize) {
        const batch = inviteeEmails.slice(i, i + batchSize);
        const docs = await firestoreClient
          .getCollection('userConfigurations')
          .where('email', 'in', batch)
          .get();

        docs.forEach((doc) => {
          const data = doc.data() as {
            deviceToken?: string;
            isEnableNotifications?: boolean;
          };
          if (
            data?.isEnableNotifications === true &&
            data?.deviceToken &&
            data.deviceToken.trim().length >= 20
          ) {
            tokens.push(data.deviceToken);
          }
        });
      }

      Logger.info('Collected device tokens', {
        requested: inviteeEmails.length,
        found: tokens.length,
      });
      return tokens;
    } catch (error) {
      Logger.error('Error getting device tokens from emails', { error });
      return [];
    }
  }

  async notifyEventUpdated(tokens: string[], event: Event): Promise<void> {
    if (tokens.length === 0) return;
    const title = '📅 Event Updated';
    const body = `The event "${event.title}" has been updated`;
    await notificationClient.sendToMultipleDevices(tokens, title, body, {
      type: 'event_updated',
      eventId: event.id,
      eventTitle: event.title,
    });
  }

  async notifyEventCancelled(tokens: string[], event: Event): Promise<void> {
    if (tokens.length === 0) return;
    const title = '❌ Event Cancelled';
    const body = `The event "${event.title}" has been cancelled`;
    await notificationClient.sendToMultipleDevices(tokens, title, body, {
      type: 'event_cancelled',
      eventId: event.id,
      eventTitle: event.title,
    });
  }

  async notifyInvited(tokens: string[], event: Event): Promise<void> {
    if (tokens.length === 0) return;
    const title = '📩 New Event Invitation';
    const body = `You have been invited to "${event.title}"`;
    await notificationClient.sendToMultipleDevices(tokens, title, body, {
      type: 'event_invitation',
      eventId: event.id,
      eventTitle: event.title,
    });
  }
}

export const notificationService = new NotificationService();
