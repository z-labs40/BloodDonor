'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { authApi, BG_TO_DISPLAY } from '@/utils/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function apiUserToUser(u: { id: string; name: string; email: string; role: string; createdAt: string }): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as User['role'],
    createdAt: u.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, token: null, isLoading: true });

  useEffect(() => {
    // Rehydrate from localStorage
    try {
      const storedUser = localStorage.getItem('blooddonor_user');
      const storedToken = localStorage.getItem('blooddonor_token');
      if (storedUser && storedToken) {
        setAuthState({ user: JSON.parse(storedUser), token: storedToken, isLoading: false });
        return;
      }
    } catch { /* ignore */ }
    setAuthState({ user: null, token: null, isLoading: false });
  }, []);

  const persist = (user: User, token: string) => {
    localStorage.setItem('blooddonor_user', JSON.stringify(user));
    localStorage.setItem('blooddonor_token', token);
    setAuthState({ user, token, isLoading: false });
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.login(email, password);
      persist(apiUserToUser(res.user), res.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Login failed.' };
    }
  };

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.adminLogin(email, password);
      if (res.user.role !== 'ADMIN') {
        return { success: false, error: 'Access denied — admin accounts only.' };
      }
      persist(apiUserToUser(res.user), res.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Admin login failed.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.signup(name, email, password);
      persist(apiUserToUser(res.user), res.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Sign up failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('blooddonor_user');
    localStorage.removeItem('blooddonor_token');
    setAuthState({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, adminLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
