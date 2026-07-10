import React, { createContext, useContext, useState } from 'react';
import { mockNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: any[];
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [nots, setNots] = useState({ ...mockNotifications });

  const notifications = user ? (nots[user.uid as keyof typeof nots] || []) : [];

  const markAllRead = () => {
    if (user) {
      setNots(prev => ({
        ...prev,
        [user.uid]: (prev[user.uid as keyof typeof nots] || []).map((n: any) => ({ ...n, isRead: true }))
      }));
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
