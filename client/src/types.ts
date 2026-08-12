// Shared domain types for the email client.

export interface Attachment {
  name?: string;
  type?: string;
  content?: string;
  src?: string;
  alt?: string;
}

export interface Mail {
  _id: string;
  sender: string;
  receiver: string;
  receiverEmail: string;
  to?: string;
  subject?: string;
  body?: string;
  attachment?: Attachment | null;
  date: string;
  starred: boolean;
  bin: boolean;
  type: string;
  name?: string;
}