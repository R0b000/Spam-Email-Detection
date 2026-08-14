import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Mail } from '../types';

// User information coming back from the database (login / register response).
export interface AuthUser {
  name: string;
  email: string;
}

// Session storage keys.
const AUTH_USER_KEY = 'auth_user';
const AUTH_EXPIRY_KEY = 'auth_expires_at';

// How long a session stays alive before the user is considered logged out (30 minutes).
export const SESSION_LIFETIME_MS = 30 * 60 * 1000;

interface AuthContextValue {
  // The currently authenticated user (comes from the DB on login).
  user: AuthUser | null;
  // All email data fetched from the DB, shared across the whole app.
  emails: Mail[];
  // True when there is a valid, unexpired session.
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setEmails: React.Dispatch<React.SetStateAction<Mail[]>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Reads a stored user from sessionStorage and returns null (clearing it) when
 * no user exists or the session has already expired.
 */
const readUserFromStorage = (): AuthUser | null => {
  try {
    const expiresAt = Number(sessionStorage.getItem(AUTH_EXPIRY_KEY));
    if (!expiresAt || Date.now() > expiresAt) {
      sessionStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_EXPIRY_KEY);
      return null;
    }

    const rawUser = sessionStorage.getItem(AUTH_USER_KEY);
    if (!rawUser) {
      return null;
    }

    const parsed = JSON.parse(rawUser) as AuthUser;
    return parsed && parsed.name && parsed.email ? parsed : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readUserFromStorage());
  const [emails, setEmails] = useState<Mail[]>([]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_EXPIRY_KEY);
    setUser(null);
    setEmails([]);
  }, []);

  const login = useCallback((nextUser: AuthUser) => {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    sessionStorage.setItem(AUTH_EXPIRY_KEY, String(Date.now() + SESSION_LIFETIME_MS));
    setUser(nextUser);
  }, []);

  // Periodically check whether the session has expired. When it has, we log the
  // user out so protected routes redirect back to the login page.
  useEffect(() => {
    if (!user) {
      return;
    }

    const checkExpiry = () => {
      const expiresAt = Number(sessionStorage.getItem(AUTH_EXPIRY_KEY));
      if (!expiresAt || Date.now() > expiresAt) {
        logout();
      }
    };

    const interval = setInterval(checkExpiry, 30 * 1000);
    return () => clearInterval(interval);
  }, [user, logout]);

  const value: AuthContextValue = {
    user,
    emails,
    isAuthenticated: !!user,
    login,
    logout,
    setEmails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;