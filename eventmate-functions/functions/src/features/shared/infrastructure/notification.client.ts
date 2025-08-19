import * as admin from 'firebase-admin';
import { Logger } from '../../shared/utils/logger';

function stringifyData(data: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = String(value);
  }
  result.timestamp = new Date().toISOString();
  return result;
}

export class NotificationClient {
  async sendToDevice(
    deviceToken: string,
    title: string,
    body: string,
    data: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      if (!deviceToken || deviceToken.length < 20) {
        Logger.warn('Skipping invalid device token', { deviceToken });
        return;
      }

      // Solo enviar data para evitar duplicación entre service worker y frontend
      const messageData = {
        title,
        body,
        ...stringifyData(data),
      };

      const message: admin.messaging.Message = {
        data: messageData,
        token: deviceToken,
      };

      const response = await admin.messaging().send(message);
      Logger.info('Notification sent to device', { response });
    } catch (error) {
      Logger.error('Error sending notification to device', { error });
    }
  }

  async sendToMultipleDevices(
    deviceTokens: string[],
    title: string,
    body: string,
    data: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      const validTokens = deviceTokens.filter(
        (t) => typeof t === 'string' && t.trim().length >= 20
      );

      if (validTokens.length === 0) {
        Logger.info('No valid device tokens to notify');
        return;
      }

      // Solo enviar data para evitar duplicación entre service worker y frontend
      const messageData = {
        title,
        body,
        ...stringifyData(data),
      };

      const message: admin.messaging.MulticastMessage = {
        data: messageData,
        tokens: validTokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      Logger.info('Multicast notification result', {
        successCount: response.successCount,
        failureCount: response.failureCount,
      });
    } catch (error) {
      Logger.error('Error sending notifications to multiple devices', {
        error,
      });
    }
  }
}

export const notificationClient = new NotificationClient();
