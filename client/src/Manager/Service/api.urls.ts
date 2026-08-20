export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ServiceUrlObject {
  endpoint: string;
  method: HttpMethod;
}

export const API_URLS: Record<string, ServiceUrlObject> = {
  savesendEmails: {
    endpoint: 'save',
    method: 'POST',
  },
  saveDraftEmails: {
    endpoint: 'save-draft',
    method: 'POST',
  },
  getEmailFromType: {
    endpoint: 'emails',
    method: 'GET',
  },
  toggleStarredMails: {
    endpoint: 'starred',
    method: 'PUT',
  },
  deleteSelectedEmails: {
    endpoint: 'bin',
    method: 'PUT',
  },
  saveSpamEmails: {
    endpoint: 'spam',
    method: 'POST',
  },
  getUnreadCount: {
    endpoint: 'unread-count',
    method: 'GET',
  },
  searchEmails: {
    endpoint: 'search-emails',
    method: 'GET',
  },
};