import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useGetMe, User } from '@workspace/api-client-react';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('wasi_token'));
  const [, setLocation] = useLocation();

  // Query will only run if we have a token (enabled: !!token)
  // But since we can't easily modify the generated hook options here without types breaking,
  // we'll just handle the error gracefully.
  const { data: user, isLoading, isError, error } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    }
  });

  useEffect(() => {
    if (isError && (error as any)?.status === 401) {
      logout();
    }
  }, [isError, error]);

  const login = (newToken: string) => {
    localStorage.setItem('wasi_token', newToken);
    setToken(newToken);
    setLocation('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('wasi_token');
    setToken(null);
    setLocation('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user: user ?? null,
        isLoading: !!token && isLoading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
