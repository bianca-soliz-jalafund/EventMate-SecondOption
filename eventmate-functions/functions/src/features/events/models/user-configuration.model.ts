import { DocumentSnapshot } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

export type UserRole = 'admin' | 'user';

interface UserConfigurationData {
  email: string;
  userId: string;
  role: UserRole;
  isEnableNotifications: boolean;
  deviceToken?: string;
}

export default class UserConfiguration {
  id: string;
  email: string;
  userId: string;
  role: UserRole;
  isEnableNotifications: boolean;
  deviceToken?: string;

  constructor(
    email: string,
    userId: string,
    role: UserRole,
    id?: string,
    isEnableNotifications?: boolean,
    deviceToken?: string
  ) {
    this.id = id ?? uuidv4();
    this.email = email;
    this.userId = userId;
    this.role = role;
    this.isEnableNotifications = isEnableNotifications ?? false;
    this.deviceToken = deviceToken;
  }

  static fromFirestore(
    doc: DocumentSnapshot<UserConfigurationData>
  ): UserConfiguration {
    const data = doc.data();
    if (!data) throw new Error('Firestore document has no data');

    return new UserConfiguration(
      data.email,
      data.userId,
      data.role,
      doc.id,
      data.isEnableNotifications,
      data.deviceToken
    );
  }

  toFirestore(): UserConfigurationData {
    return {
      email: this.email,
      userId: this.userId,
      role: this.role,
      isEnableNotifications: this.isEnableNotifications,
      deviceToken: this.deviceToken,
    };
  }
}
