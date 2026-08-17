export interface Attachment {
  name?: string;
  type?: string;
  content?: string;
  src?: string;
  alt?: string;
}

export interface EmailContent {
  subject?: string;
  body?: string;
  attachment?: Attachment | null;
}

export interface SendEmailRequest {
  senderId: string;
  receiverEmail: string;
  content: EmailContent;
  name: string;
  date: string;
  starred: boolean;
  bin: boolean;
  type: string;
}

export interface SaveDraftRequest {
  senderId: string;
  receiverEmail: string | null;
  content: EmailContent | null;
  name: string;
  date: string;
  starred: boolean;
  bin: boolean;
  type: 'draft';
}

export interface SaveSpamRequest {
  senderId: string;
  receiverEmail: string;
  content: EmailContent;
  name: string;
  date: string;
  starred: boolean;
  bin: boolean;
  type: 'spam';
}

export interface DeleteEmailsRequest {
  messageIds: string[];
  type: string;
  value: boolean;
}

export interface ToggleStarredRequest {
  id: string;
  value: boolean;
}

export interface SpamDetectionRequest {
  emailSubject: string;
  emailBody: string;
}
