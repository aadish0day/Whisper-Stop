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
        className="mb-6 flex items-center justify-center relative" 
        style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: 'color-mix(in srgb, var(--color-surface-hover) 50%, transparent)',
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed animate-pulse-soft" style={{ borderColor: 'var(--color-text-muted)', transform: 'scale(1.15)' }} />
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
