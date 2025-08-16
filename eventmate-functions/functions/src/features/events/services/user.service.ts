import { firestoreClient } from '../../shared/infrastructure/firestore.client';
import { Logger } from '../../shared/utils/logger';
import UserConfiguration from '../models/user-configuration.model';

export class UserService {
  /**
   * Verifica si un usuario existe por email
   */
  async userExistsByEmail(email: string): Promise<boolean> {
    try {
      Logger.info('Checking if user exists by email', { email });
      const userDoc = await firestoreClient.getUserByEmail(email);

      const exists = userDoc !== null;
      Logger.info('User existence check result', { email, exists });

      return exists;
    } catch (error) {
      Logger.error('Error checking user existence', { email, error });
      throw new Error(`Failed to check user existence: ${error}`);
    }
  }

  /**
   * Obtiene un usuario por email
   */
  async getUserByEmail(email: string): Promise<UserConfiguration | null> {
    try {
      Logger.info('Getting user by email', { email });
      const userDoc = await firestoreClient.getUserByEmail(email);

      if (!userDoc) {
        Logger.info('User not found', { email });
        return null;
      }

      const user = UserConfiguration.fromFirestore(
        userDoc as FirebaseFirestore.DocumentSnapshot<UserConfiguration>
      );

      Logger.info('User retrieved successfully', { email, userId: user.id });

      return user;
    } catch (error) {
      Logger.error('Error getting user by email', { email, error });
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  /**
   * Crea un nuevo usuario (placeholder para cuando se registre)
   */
  async createUserConfiguration(userData: {
    email: string;
    userId: string;
    role?: 'admin' | 'user';
    isEnableNotifications?: boolean;
  }): Promise<string> {
    try {
      Logger.info('Creating user configuration', { email: userData.email });

      const newUser = new UserConfiguration(
        userData.email,
        userData.userId,
        userData.role || 'user',
        undefined,
        userData.isEnableNotifications
      );

      const userId = await firestoreClient.createUserConfiguration(
        newUser.toFirestore() as unknown as Record<string, unknown>
      );

      Logger.info('User configuration created successfully', {
        userId,
        email: userData.email,
      });

      return userId;
    } catch (error) {
      Logger.error('Error creating user configuration', { userData, error });
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  /**
   * Obtiene todos los usuarios que tienen habilitadas las notificaciones
   */
  async getUsersWithNotificationsEnabled(): Promise<UserConfiguration[]> {
    try {
      Logger.info('Getting users with notifications enabled');

      const userDocs = await firestoreClient.queryDocuments(
        'userConfigurations',
        'isEnableNotifications',
        '==',
        true
      );

      const users = userDocs.map((doc) =>
        UserConfiguration.fromFirestore(
          doc as FirebaseFirestore.DocumentSnapshot<UserConfiguration>
        )
      );

      Logger.info('Retrieved users with notifications', {
        count: users.length,
      });

      return users;
    } catch (error) {
      Logger.error('Error getting users with notifications enabled', error);
      throw new Error(`Failed to get users with notifications: ${error}`);
    }
  }

  /**
   * Filtra usuarios por lista de emails
   */
  async getUsersByEmails(emails: string[]): Promise<UserConfiguration[]> {
    try {
      Logger.info('Getting users by email list', { emailCount: emails.length });

      const users: UserConfiguration[] = [];

      for (const email of emails) {
        const user = await this.getUserByEmail(email);
        if (user && user.isEnableNotifications) {
          users.push(user);
        }
      }

      Logger.info('Retrieved users from email list', {
        requestedCount: emails.length,
        foundCount: users.length,
      });

      return users;
    } catch (error) {
      Logger.error('Error getting users by emails', { emails, error });
      throw new Error(`Failed to get users by emails: ${error}`);
    }
  }
}
