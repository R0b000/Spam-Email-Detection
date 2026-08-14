import httpClient from '../../Configuration/axios';

/** Authentication API calls — talks directly to the backend. */
export const authService = {
  login: (email: string, password: string) =>
    httpClient.post('/login', { email, password }),

  register: (data: { name: string; email: string; password: string }) =>
    httpClient.post('/register', data),

  logout: () => httpClient.post('/logout'),
};