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
  isRead: boolean;
  type: string;
  name?: string;
}

export interface SendEmailResponse {
  message: string;
  data: Mail;
}

export interface SpamDetectionResponse {
  result: string;
}

export interface EmailsListResponse {
  message: string;
  data: Mail[];
}

export interface DeleteEmailsResponse {
  message: string;
}

export interface ToggleStarredResponse {
  message: string;
}
