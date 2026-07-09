import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

interface User {
  uid: string;
  displayName: string;
  email: string;
  reputation: number;
  isAdmin: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (uid: string) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('whisperstop-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (uid: string) => {
    const found = mockUsers.find(u => u.uid === uid) || mockUsers[0];
    setUser(found);
    localStorage.setItem('whisperstop-user', JSON.stringify(found));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whisperstop-user');
  };

  const register = (name: string, email: string) => {
    const newUser = {
      uid: 'u' + Date.now(),
      displayName: name,
      email,
      photoURL: null,
      reputation: 10,
      totalVerifications: 0,
      correctVerifications: 0,
      submittedClaims: 0,
      isAdmin: false,
      joinedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('whisperstop-user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
