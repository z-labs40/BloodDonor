'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { MOCK_USERS } from '@/data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    // Rehydrate from localStorage
    const stored = localStorage.getItem('blooddonor_user');
    if (stored) {
      try {
        const user: User = JSON.parse(stored);
        setAuthState({ user, isLoading: false });
      } catch {
        setAuthState({ user: null, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isLoading: false });
    }
  }, []);

  const login = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'Invalid email or password.' };
    localStorage.setItem('blooddonor_user', JSON.stringify(user));
    setAuthState({ user, isLoading: false });
    return { success: true };
  };

  const signup = async (name: string, email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const existing = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return { success: false, error: 'An account with this email already exists.' };
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
    };
    MOCK_USERS.push(newUser);
    localStorage.setItem('blooddonor_user', JSON.stringify(newUser));
    setAuthState({ user: newUser, isLoading: false });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('blooddonor_user');
    setAuthState({ user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
