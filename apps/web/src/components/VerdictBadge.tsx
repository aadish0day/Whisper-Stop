import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface VerdictBadgeProps {
  verdict: string | null;
  size?: 'sm' | 'lg';
}

export function VerdictBadge({ verdict, size = 'sm' }: VerdictBadgeProps) {
  let colorVar = '--color-text-muted';
  let icon = <Clock size={size === 'sm' ? 14 : 20} />;
  let label = verdict || 'PENDING';

  switch (verdict) {
    case 'TRUE':
      colorVar = '--verdict-true';
      icon = <CheckCircle2 size={size === 'sm' ? 14 : 20} />;
      break;
    case 'FALSE':
      colorVar = '--verdict-false';
      icon = <XCircle size={size === 'sm' ? 14 : 20} />;
      break;
    case 'MISLEADING':
      colorVar = '--verdict-misleading';
      icon = <AlertTriangle size={size === 'sm' ? 14 : 20} />;
      break;
    case 'UNVERIFIABLE':
      colorVar = '--verdict-unverifiable';
      icon = <HelpCircle size={size === 'sm' ? 14 : 20} />;
      break;
    default:
      colorVar = '--verdict-pending';
      label = 'PENDING';
      break;
  }

  return (
    <div 
      className={clsx(
        "inline-flex items-center justify-center font-medium",
        !verdict && "animate-pulse-soft"
      )}
      style={{
        backgroundColor: `color-mix(in srgb, var(${colorVar}) 15%, transparent)`,
        color: `var(${colorVar})`,
        padding: size === 'sm' ? '4px 10px' : '8px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: size === 'sm' ? '12px' : '16px',
        gap: '6px',
        border: `1px solid color-mix(in srgb, var(${colorVar}) 30%, transparent)`
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
