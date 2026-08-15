export interface LoginResponse {
  message: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface RegisterResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthUser {
  name: string;
  email: string;
}
