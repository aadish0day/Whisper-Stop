import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div 
        className="mb-4 flex items-center justify-center" 
        style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--color-surface-hover)',
          color: 'var(--color-text-muted)'
        }}
      >
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-secondary max-w-md mx-auto mb-6">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
