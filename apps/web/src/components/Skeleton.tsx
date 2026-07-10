import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div 
      className={clsx("skeleton-bg", className)}
      style={{
        borderRadius: 'var(--radius-sm)',
        ...style
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card flex flex-col justify-between" style={{ height: '220px' }}>
      <div>
        <div className="flex justify-between mb-4">
          <Skeleton style={{ width: '80px', height: '24px', borderRadius: '12px' }} />
          <Skeleton style={{ width: '60px', height: '24px', borderRadius: '4px' }} />
        </div>
        <Skeleton style={{ width: '100%', height: '24px', marginBottom: '8px' }} />
        <Skeleton style={{ width: '80%', height: '24px', marginBottom: '8px' }} />
        <Skeleton style={{ width: '60%', height: '24px' }} />
      </div>
      <div className="mt-4">
        <Skeleton style={{ width: '100%', height: '8px', marginBottom: '12px' }} />
        <div className="flex justify-between">
          <Skeleton style={{ width: '80px', height: '16px' }} />
          <Skeleton style={{ width: '60px', height: '16px' }} />
        </div>
      </div>
    </div>
  );
}
