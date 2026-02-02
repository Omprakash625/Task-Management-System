'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


  const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });

    // Backend now returns { success, data }
    const { user, accessToken, refreshToken } = response.data.data;

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Set user in context
    setUser(user);

    toast.success('Login successful!');

    // Optional: wait a tick to ensure user state updates
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Redirect after user is set
    router.push('/dashboard');
  } catch (error: any) {
    const message = error.response?.data?.error || 'Login failed';
    toast.error(message);
    throw error;
  }
};


  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.post('/auth/register', { email, password, name });

      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(user);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
