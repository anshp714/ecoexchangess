
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentLocale } from '@/locales/client';

export type UserRole = 'buyer' | 'seller' | 'logistics';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<User | null>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock Storage for users
const MOCK_USERS_KEY = 'ecoexchange_mock_users';
const CURRENT_USER_KEY = 'ecoexchange_current_user';

const getMockUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const setMockUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const locale = useCurrentLocale();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(CURRENT_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    // This is a mock implementation. Do not use in production.
    const users = getMockUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      // In a real app, you'd check a hashed password. Here we just accept.
      const userWithImage = {
        ...foundUser,
        profileImageUrl: `https://picsum.photos/seed/${foundUser.name.split(' ')[0]}/40/40`
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithImage));
      setUser(userWithImage);
      return userWithImage;
    }
    return null;
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<User | null> => {
    const users = getMockUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = { name, email, role };
    const updatedUsers = [...users, newUser];
    setMockUsers(updatedUsers);

    const userWithImage = {
        ...newUser,
        profileImageUrl: `https://picsum.photos/seed/${newUser.name.split(' ')[0]}/40/40`
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithImage));
    setUser(userWithImage);
    return userWithImage;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    router.push(`/${locale}/login`);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
