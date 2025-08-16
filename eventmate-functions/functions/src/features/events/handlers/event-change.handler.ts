import { DocumentSnapshot } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { Logger } from '../../shared/utils/logger';
import Event, { EventData } from '../models/event.model';
import { EmailService } from '../services/email.service';
import { EventService } from '../services/event.service';
import { notificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

const eventService = new EventService();
const userService = new UserService();
const emailService = new EmailService();

/**
 * Helper para normalizar fechas de Firestore (Timestamp o Date)
 */
function toDate(value?: Date | { toDate: () => Date }): Date | undefined {
  if (!value) return undefined;
  if ('toDate' in value) return value.toDate();
  return value;
}

/**
 * Función auxiliar para detectar cambios importantes en eventos
 */
function detectImportantChanges(before: EventData, after: EventData): string[] {
  const changes: string[] = [];
  const importantFields = [
    { field: 'title', label: 'Título' },
    { field: 'description', label: 'Descripción' },
    { field: 'date', label: 'Fecha' },
    { field: 'place', label: 'Lugar' },
  ];

  importantFields.forEach(({ field, label }) => {
    if (field === 'date') {
      const beforeDate = toDate(before.date)?.getTime();
      const afterDate = toDate(after.date)?.getTime();
      if (beforeDate !== afterDate) changes.push(label);
    } else {
      if (before[field as keyof EventData] !== after[field as keyof EventData])
        changes.push(label);
    }
  });

  return changes;
}

/**
 * Cloud Function que se dispara cuando un evento se CREA, ACTUALIZA o ELIMINA
 */
export const onEventsWritten = onDocumentWritten(
  {
    document: 'events/{eventId}',
    region: 'us-central1',
  },
  async (event) => {
    const eventId = event.params.eventId;

    try {
      if (!event.data) {
        Logger.warn('Event change triggered without data.', { eventId });
        return;
      }

      const before = event.data.before ?? null;
      const after = event.data.after ?? null;

      // Casteo explícito de snapshots para evitar TS2345
      const beforeTyped: DocumentSnapshot<EventData> =
        before as DocumentSnapshot<EventData>;
      const afterTyped: DocumentSnapshot<EventData> =
        after as DocumentSnapshot<EventData>;

      Logger.info('Event change detected (onEventChange)', {
        eventId,
        exists: { before: before?.exists, after: after?.exists },
      });

      const changeType = eventService.detectEventChange(
        beforeTyped,
        afterTyped
      );
      if (!changeType) {
        Logger.info('No significant changes detected (onEventChange)', {
          eventId,
        });
        return;
      }

      let eventData: Event | null = null;
      let invitees: string[] = [];

      if (changeType === 'cancelled') {
        if (beforeTyped?.exists) {
          const beforeData = beforeTyped.data() as EventData;
          if (!beforeData) throw new Error('Missing event data');
          eventData = Event.fromFirestoreData(beforeData, beforeTyped.id);
          invitees = beforeData.invitees ?? [];
        }
      } else {
        if (afterTyped?.exists) {
          const afterData = afterTyped.data() as EventData;
          if (!afterData) throw new Error('Missing event data');
          eventData = Event.fromFirestoreData(afterData, afterTyped.id);
          invitees = afterData.invitees ?? [];
        }
      }

      if (!eventData) {
        Logger.error('Could not retrieve event data (onEventChange)', {
          eventId,
          changeType,
        });
        return;
      }

      if (invitees.length === 0) {
        Logger.info('No invitees to notify (onEventChange)', { eventId });
        return;
      }

      const registeredUsers = await userService.getUsersByEmails(invitees);
      const registeredEmails = new Set(registeredUsers.map((u) => u.email));
      const unregisteredEmails = invitees.filter(
        (email) => !registeredEmails.has(email)
      );

      const notificationPromises: Promise<void>[] = [];

      if (registeredUsers.length > 0) {
        notificationPromises.push(
          emailService.sendEventChangeNotification(
            registeredUsers,
            eventData,
            changeType
          )
        );
        // Push notifications to registered users
        const tokens = await notificationService.getDeviceTokensFromEmails(
          registeredUsers.map((u) => u.email)
        );
        if (changeType === 'cancelled') {
          notificationPromises.push(
            notificationService.notifyEventCancelled(tokens, eventData)
          );
        } else {
          notificationPromises.push(
            notificationService.notifyEventUpdated(tokens, eventData)
          );
        }
      }

      if (unregisteredEmails.length > 0) {
        notificationPromises.push(
          emailService.sendNotificationToInvitees(
            unregisteredEmails,
            eventData,
            changeType
          )
        );
      }

      await Promise.allSettled(notificationPromises);

      Logger.info('Event change notifications completed (onEventChange)', {
        eventId,
        changeType,
      });
    } catch (error) {
      Logger.error('Error in onEventChange', {
        eventId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);
