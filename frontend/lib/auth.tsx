'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login, register, refreshToken, getMe } from './api';

interface User {
  name: ReactNode;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  eid: string;
  major: string;
  year: number;
  role: string;
  roles: Array<{role: string; team?: string; system?: string}>;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, eid: string, major: string, year: number) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      getMe(token)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    setUser(result.user);
    setAccessToken(result.accessToken);
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
  };

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    eid: string,
    major: string,
    year: number
  ) => {
    const result = await register(email, password, firstName, lastName, eid, major, year);
    setUser(result.user);
    setAccessToken(result.accessToken);
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
