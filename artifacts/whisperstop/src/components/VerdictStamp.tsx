import React from 'react';
import { clsx } from 'clsx';

interface VerdictStampProps {
  verdict: string;
  claimId: string;
}

export function VerdictStamp({ verdict, claimId }: VerdictStampProps) {
  const charSum = claimId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rotateDeg = -4 - (charSum % 8); 
  const rotateOvershoot = rotateDeg - 10;

  let colorVar = '--verdict-unverifiable';
  if (verdict === 'TRUE') colorVar = '--verdict-true';
  else if (verdict === 'FALSE') colorVar = '--verdict-false';
  else if (verdict === 'MISLEADING') colorVar = '--verdict-misleading';

  return (
    <div 
      className="stamp-animate"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        border: `8px solid var(${colorVar})`,
        color: `var(${colorVar})`,
        fontSize: verdict.length > 5 ? '24px' : '32px',
        letterSpacing: '4px',
        '--stamp-rotate': `${rotateDeg}deg`,
        '--stamp-rotate-overshoot': `${rotateOvershoot}deg`,
        animation: 'stamp var(--transition-stamp) forwards',
      } as React.CSSProperties}
    >
      <div 
        style={{
          position: 'absolute',
          inset: '4px',
          borderRadius: '50%',
          border: `2px dashed var(${colorVar})`,
          opacity: 0.8
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, padding: '0 10px', textAlign: 'center', lineHeight: 1.1 }}>
        {verdict}
      </span>
    </div>
  );
}
