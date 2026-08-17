import httpClient from '../../Configuration/axios';
import type { LoginRequest, RegisterRequest } from '../../Model/RequestModel/AuthModel/AuthRequestModel';

/** Authentication API calls — talks directly to the backend. */
export const authService = {
  login: ({ email, password }: LoginRequest) =>
    httpClient.post('/login', { email, password }),

  register: (data: RegisterRequest) =>
    httpClient.post('/register', data),

  logout: () => httpClient.post('/logout'),

  checkEmail: (email: string) =>
    httpClient.post('/check-email', { email }),
};