import * as admin from 'firebase-admin';
import { firestoreClient } from '../../shared/infrastructure/firestore.client';
import { Logger } from '../../shared/utils/logger';
import Event, { EventData } from '../models/event.model';

/**
 * Convierte cualquier fecha de Firestore o Date a timestamp en ms.
 */
function getTime(
  value?: Date | { toDate: () => Date } | admin.firestore.Timestamp
): number | undefined {
  if (!value) return undefined;

  if ('toMillis' in value && typeof value.toMillis === 'function') {
    return value.toMillis();
  }

  if ('toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return undefined;
}

export class EventService {
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      Logger.info('Getting event by ID', { eventId });

      const eventDoc = await firestoreClient.getEventById(eventId);
      if (!eventDoc || !eventDoc.exists) {
        Logger.info('Event not found', { eventId });
        return null;
      }

      const data = eventDoc.data() as EventData;
      if (!data) throw new Error('Missing event data');

      const event = Event.fromFirestoreData(data, eventDoc.id);
      Logger.info('Event retrieved successfully', {
        eventId,
        title: event.title,
      });

      return event;
    } catch (error) {
      Logger.error('Error getting event by ID', { eventId, error });
      throw new Error(`Failed to get event: ${error}`);
    }
  }

  async addInviteeToEvent(eventId: string, email: string): Promise<void> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      Logger.info('Adding invitee to event', {
        eventId,
        email: normalizedEmail,
      });
      await firestoreClient.addInviteeToEvent(eventId, normalizedEmail);
      Logger.info('Invitee added successfully', { eventId, email });
    } catch (error) {
      Logger.error('Error adding invitee to event', { eventId, email, error });
      throw new Error(`Failed to add invitee: ${error}`);
    }
  }

  async updateEvent(
    eventId: string,
    updateData: Partial<Event>
  ): Promise<void> {
    try {
      Logger.info('Updating event', {
        eventId,
        updateFields: Object.keys(updateData),
      });
      await firestoreClient.updateEvent(eventId, updateData);
      Logger.info('Event updated successfully', { eventId });
    } catch (error) {
      Logger.error('Error updating event', { eventId, error });
      throw new Error(`Failed to update event: ${error}`);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      Logger.info('Deleting event', { eventId });
      await firestoreClient.deleteDocument('events', eventId);
      Logger.info('Event deleted successfully', { eventId });
    } catch (error) {
      Logger.error('Error deleting event', { eventId, error });
      throw new Error(`Failed to delete event: ${error}`);
    }
  }

  async isEmailAlreadyInvited(
    eventId: string,
    email: string
  ): Promise<boolean> {
    const event = await this.getEventById(eventId);
    if (!event) throw new Error('Event not found');
    return event.invitees.includes(email);
  }

  async getEventInvitees(eventId: string): Promise<string[]> {
    const event = await this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    Logger.info('Retrieved event invitees', {
      eventId,
      inviteesCount: event.invitees.length,
    });
    return event.invitees;
  }

  detectEventChange(
    before: admin.firestore.DocumentSnapshot<EventData>,
    after: admin.firestore.DocumentSnapshot<EventData>
  ): 'updated' | 'cancelled' | null {
    if (!after.exists && before.exists) return 'cancelled';
    if (after.exists && before.exists) {
      const beforeData = before.data()!;
      const afterData = after.data()!;
      const importantFields: (keyof EventData)[] = [
        'title',
        'description',
        'date',
        'place',
        'invitees',
      ];

      // Log para debugging
      console.log('Comparing event data:', {
        before: {
          title: beforeData.title,
          description: beforeData.description,
          date: beforeData.date,
          place: beforeData.place,
        },
        after: {
          title: afterData.title,
          description: afterData.description,
          date: afterData.date,
          place: afterData.place,
        },
      });

      const hasChanges = importantFields.some((field) => {
        if (field === 'date') {
          const beforeTime = getTime(beforeData.date);
          const afterTime = getTime(afterData.date);
          const changed = beforeTime !== afterTime;
          console.log(`Date comparison for ${field}:`, {
            beforeTime,
            afterTime,
            changed,
          });
          return changed;
        }
        let changed = false;
        if (field === 'invitees') {
          // Para arrays, comparar contenido, no referencia
          const beforeArray = beforeData[field] || [];
          const afterArray = afterData[field] || [];
          changed =
            beforeArray.length !== afterArray.length ||
            beforeArray.some((item, index) => item !== afterArray[index]);
          console.log(`Array comparison for ${field}:`, {
            before: beforeArray,
            after: afterArray,
            changed,
          });
        } else {
          changed = beforeData[field] !== afterData[field];
          console.log(`Field comparison for ${field}:`, {
            before: beforeData[field],
            after: afterData[field],
            changed,
          });
        }
        return changed;
      });

      console.log('Has changes:', hasChanges);
      if (hasChanges) return 'updated';
    }
    return null;
  }
}
