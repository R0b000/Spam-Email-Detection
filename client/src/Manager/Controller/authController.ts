import { authService } from '../Service/authService';

/**
 * Business-logic controller for authentication.
 *
 * Components call this layer (never the service directly) so that any
 * pre-processing, validation, or side-effects live here in one place.
 */
export const authController = {
  /** Log in and return { message, user } or throw / return error shape. */
  login: async (email: string, password: string) => {
    const { data } = await authService.login(email, password);
    return data as { message: string; user?: { name: string; email: string } };
  },

  /** Register a new account, returning the created user document. */
  register: async (payload: { name: string; email: string; password: string }) => {
    const { data } = await authService.register(payload);
    return data;
  },

  /** Log out. */
  logout: async () => {
    const { data } = await authService.logout();
    return data as Record<string, unknown>;
  },
};