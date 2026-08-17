import { authService } from '../Service/authService';
import type { LoginRequest, RegisterRequest } from '../../Model/RequestModel/AuthModel/AuthRequestModel';
import type { LoginResponse, RegisterResponse } from '../../Model/ResponseModel/AuthModel/AuthResponseModel';

/**
 * Business-logic controller for authentication.
 *
 * Components call this layer (never the service directly) so that any
 * pre-processing, validation, or side-effects live here in one place.
 */
export const authController = {
  /** Log in and return { message, user } or throw / return error shape. */
  login: async ({ email, password }: LoginRequest) => {
    const { data } = await authService.login({ email, password });
    return data as LoginResponse;
  },

  /** Register a new account, returning the created user document. */
  register: async (payload: RegisterRequest) => {
    const { data } = await authService.register(payload);
    return data as RegisterResponse;
  },

  /** Check if an email exists. Returns { message, name } or throws 404. */
  checkEmail: async (email: string) => {
    const { data } = await authService.checkEmail(email);
    return data as { message: string; name: string };
  },

  /** Log out. */
  logout: async () => {
    const { data } = await authService.logout();
    return data as Record<string, unknown>;
  },
};
