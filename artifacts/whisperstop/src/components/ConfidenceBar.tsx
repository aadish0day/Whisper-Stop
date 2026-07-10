import React, { useEffect, useState } from 'react';

interface ConfidenceBarProps {
  score: number | null;
}

export function ConfidenceBar({ score }: ConfidenceBarProps) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    if (score === null) return;
    const timer = setTimeout(() => setFill(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  if (score === null) return null;

  let colorVar = '--verdict-true';
  if (score < 40) colorVar = '--verdict-false';
  else if (score <= 70) colorVar = '--verdict-misleading';

  return (
    <div style={{ width: '100%', marginTop: 'var(--space-3)' }}>
      <div className="flex justify-between items-center mb-1">
        <span className="data-text text-secondary">SYS.CONFIDENCE</span>
        <span className="data-text" style={{ color: `var(${colorVar})` }}>{score}%</span>
      </div>
      <div 
        style={{
          height: '12px',
          backgroundColor: 'var(--color-bg)',
          overflow: 'hidden',
          border: '2px solid var(--color-border)',
          display: 'flex',
          gap: '2px',
          padding: '2px'
        }}
      >
        <div 
          style={{
            height: '100%',
            width: `${fill}%`,
            background: `repeating-linear-gradient(90deg, var(${colorVar}) 0, var(${colorVar}) 4px, transparent 4px, transparent 6px)`,
            transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}
