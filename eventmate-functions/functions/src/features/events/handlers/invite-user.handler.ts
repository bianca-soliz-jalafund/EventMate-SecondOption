import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';
import { Logger } from '../../shared/utils/logger';
import { EmailService } from '../services/email.service';
import { EventService } from '../services/event.service';
import { notificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

const userService = new UserService();
const eventService = new EventService();
const emailService = new EmailService();

/**
 * Cloud Function (v2) que maneja las invitaciones por email.
 * Se ejecuta via HTTP cuando un usuario invita a otro.
 */
export const inviteUserToEvent = onCall(
  { region: 'us-central1' },
  async (request) => {
    try {
      if (!request.auth) {
        throw new HttpsError(
          'unauthenticated',
          'User must be authenticated to invite others.'
        );
      }

      const { eventId, email: emailRaw, inviteeEmail } = request.data;
      const email = (emailRaw || inviteeEmail || '').toLowerCase().trim();

      if (!eventId || !email) {
        throw new HttpsError(
          'invalid-argument',
          'eventId and email are required.'
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new HttpsError('invalid-argument', 'Invalid email format.');
      }

      Logger.info('Processing user invitation', {
        eventId,
        email,
        inviterUid: request.auth.uid,
      });

      const event = await eventService.getEventById(eventId);
      if (!event) {
        throw new HttpsError('not-found', 'Event not found.');
      }

      if (event.ownerId !== request.auth.uid) {
        throw new HttpsError(
          'permission-denied',
          'Only the event owner can send invitations.'
        );
      }

      const isAlreadyInvited = await eventService.isEmailAlreadyInvited(
        eventId,
        email
      );
      if (isAlreadyInvited) {
        throw new HttpsError(
          'already-exists',
          'This email is already invited to the event.'
        );
      }

      const userExists = await userService.userExistsByEmail(email);
      if (userExists) {
        await eventService.addInviteeToEvent(eventId, email);
        Logger.info('User exists - added as invitee', { eventId, email });
        // Send push notification to invited user if they have a device token
        const tokens = await notificationService.getDeviceTokensFromEmails([
          email,
        ]);
        await notificationService.notifyInvited(tokens, event);
        return {
          success: true,
          message: 'User successfully invited to the event.',
          userExists: true,
          action: 'added_as_invitee',
        };
      } else {
        await emailService.sendRegistrationInvitation(email, event);
        Logger.info('User does not exist - invitation email sent', {
          eventId,
          email,
        });
        return {
          success: true,
          message:
            'Invitation email sent. User will be added to the event once they register.',
          userExists: false,
          action: 'invitation_email_sent',
        };
      }
    } catch (error) {
      Logger.error('Error in inviteUserToEvent', {
        error,
        data: request.data,
        auth: request.auth?.uid,
      });

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        'internal',
        'An internal error occurred while processing the invitation.'
      );
    }
  }
);

/**
 * Cloud Function HTTP (v2) alternativa para invitaciones (REST)
 */
export const inviteUserToEventHTTP = onRequest(
  { region: 'us-central1' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - Bearer token required' });
        return;
      }

      const { eventId, email, ownerUid } = req.body;
      if (!eventId || !email || !ownerUid) {
        res
          .status(400)
          .json({ error: 'eventId, email, and ownerUid are required' });
        return;
      }

      Logger.info('Processing HTTP user invitation', {
        eventId,
        email,
        ownerUid,
      });

      const event = await eventService.getEventById(eventId);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      if (event.ownerId !== ownerUid) {
        res.status(403).json({ error: 'Permission denied - not event owner' });
        return;
      }

      const isAlreadyInvited = await eventService.isEmailAlreadyInvited(
        eventId,
        email
      );
      if (isAlreadyInvited) {
        res.status(409).json({ error: 'Email already invited' });
        return;
      }

      await eventService.addInviteeToEvent(eventId, email);
      const userExists = await userService.userExistsByEmail(email);

      if (userExists) {
        // Enviar push al invitado si tiene notificaciones habilitadas
        try {
          const tokens = await notificationService.getDeviceTokensFromEmails([
            email,
          ]);
          await notificationService.notifyInvited(tokens, event);
        } catch (notifyError) {
          Logger.warn('Failed to send invite push notification', {
            error: notifyError,
            email,
          });
        }

        res.status(200).json({
          success: true,
          message: 'User successfully invited',
          userExists: true,
        });
      } else {
        await emailService.sendRegistrationInvitation(email, event);
        res.status(200).json({
          success: true,
          message: 'Invitation email sent',
          userExists: false,
        });
      }
    } catch (error) {
      Logger.error('Error in inviteUserToEventHTTP', { error, body: req.body });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
