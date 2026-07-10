import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 
        size={size} 
        className="text-accent" 
        style={{ animation: 'spin 1s linear infinite' }} 
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
