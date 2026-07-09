import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../logic/formatDate';

export function NotificationBell() {
  const { notifications, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="btn-icon relative"
        style={{ color: 'var(--color-text)' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span 
            className="absolute"
            style={{
              top: '4px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--verdict-false)',
              borderRadius: '50%'
            }}
          />
        )}
      </button>

      {open && (
        <div 
          className="absolute card"
          style={{
            top: 'calc(100% + var(--space-2))',
            right: 0,
            width: '320px',
            padding: '0',
            zIndex: 50,
            overflow: 'hidden'
          }}
        >
          <div className="flex items-center justify-between" style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 500 }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div 
                  key={n.id}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: n.isRead ? 'transparent' : 'var(--color-surface-hover)'
                  }}
                >
                  <p style={{ fontSize: '14px', marginBottom: '4px' }}>{n.message}</p>
                  <p className="data-text text-muted">{formatDate(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
