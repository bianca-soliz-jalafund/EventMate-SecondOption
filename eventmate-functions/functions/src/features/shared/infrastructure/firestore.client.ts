import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export class FirestoreClient {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  async getDocument<T = FirebaseFirestore.DocumentData>(
    collection: string,
    id: string
  ): Promise<FirebaseFirestore.DocumentSnapshot<T> | null> {
    const doc = await this.db.collection(collection).doc(id).get();
    return doc.exists ? (doc as FirebaseFirestore.DocumentSnapshot<T>) : null;
  }

  async createDocument<T extends Record<string, unknown>>(
    collection: string,
    data: T,
    id?: string
  ): Promise<string> {
    if (id) {
      await this.db.collection(collection).doc(id).set(data);
      return id;
    } else {
      const docRef = await this.db.collection(collection).add(data);
      return docRef.id;
    }
  }

  async updateDocument<T extends Record<string, unknown>>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    await this.db.collection(collection).doc(id).update(data);
  }

  async deleteDocument(collection: string, id: string): Promise<void> {
    await this.db.collection(collection).doc(id).delete();
  }

  async queryDocuments<T = FirebaseFirestore.DocumentData>(
    collection: string,
    field: string,
    operator: FirebaseFirestore.WhereFilterOp,
    value: unknown
  ): Promise<FirebaseFirestore.QueryDocumentSnapshot<T>[]> {
    const snapshot = await this.db
      .collection(collection)
      .where(field, operator, value)
      .get();
    return snapshot.docs as FirebaseFirestore.QueryDocumentSnapshot<T>[];
  }

  async getEventById(eventId: string) {
    return this.getDocument<{ invitees?: string[] }>('events', eventId);
  }

  async updateEvent(eventId: string, data: Partial<{ invitees: string[] }>) {
    return this.updateDocument('events', eventId, data);
  }

  async addInviteeToEvent(eventId: string, email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const eventDoc = await this.getEventById(eventId);
    if (!eventDoc) {
      throw new Error('Event not found');
    }

    const eventData = eventDoc.data();
    const currentInvitees = eventData?.invitees || [];

    if (!currentInvitees.includes(normalizedEmail)) {
      const updatedInvitees = [...currentInvitees, normalizedEmail];
      await this.updateEvent(eventId, { invitees: updatedInvitees });
    }
  }

  async getUserByEmail(email: string) {
    const docs = await this.queryDocuments<{ email: string }>(
      'userConfigurations',
      'email',
      '==',
      email
    );
    return docs.length > 0 ? docs[0] : null;
  }

  async createUserConfiguration(data: Record<string, unknown>) {
    return this.createDocument('userConfigurations', data);
  }

  getCollection(name: string) {
    return this.db.collection(name);
  }
}

export const firestoreClient = new FirestoreClient();
