import { DocumentSnapshot } from 'firebase-admin/firestore';

export interface EventData {
  title: string;
  description: string;
  date: { toDate: () => Date } | Date;
  image: string;
  category: string;
  ownerId: string;
  ownerName: string;
  createdAt: { toDate: () => Date } | Date;
  attendeesAmount: number;
  invitees?: string[];
  place: string;
}

export default class Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  image: string;
  category: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  attendeesAmount: number;
  invitees: string[] = [];
  place: string;

  constructor(
    id: string,
    title: string,
    description: string,
    date: Date,
    image: string,
    category: string,
    ownerId: string,
    ownerName: string,
    createdAt: Date,
    attendeesAmount: number,
    invitees: string[] = [],
    place: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.image = image;
    this.category = category;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.createdAt = createdAt;
    this.attendeesAmount = attendeesAmount;
    this.invitees = invitees;
    this.place = place;
  }

  static fromFirestore(doc: DocumentSnapshot<EventData>): Event {
    const data = doc.data();
    if (!data) throw new Error('Firestore document has no data');

    return new Event(
      doc.id,
      data.title,
      data.description,
      data.date instanceof Date ? data.date : data.date.toDate(),
      data.image,
      data.category,
      data.ownerId,
      data.ownerName,
      data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate(),
      data.attendeesAmount,
      data.invitees || [],
      data.place
    );
  }

  toFirestore(): EventData {
    return {
      title: this.title,
      description: this.description,
      date: this.date,
      image: this.image,
      category: this.category,
      ownerId: this.ownerId,
      ownerName: this.ownerName,
      createdAt: this.createdAt,
      attendeesAmount: this.attendeesAmount,
      invitees: this.invitees,
      place: this.place,
    };
  }

  static fromFirestoreData(data: EventData, id: string): Event {
    return new Event(
      id,
      data.title,
      data.description,
      data.date instanceof Date ? data.date : data.date.toDate(),
      data.image,
      data.category,
      data.ownerId,
      data.ownerName,
      data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate(),
      data.attendeesAmount,
      data.invitees || [],
      data.place
    );
  }
}
