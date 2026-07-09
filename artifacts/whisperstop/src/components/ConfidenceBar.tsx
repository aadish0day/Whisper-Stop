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
        <span className="body-small text-secondary font-medium">Community Confidence</span>
        <span className="data-text font-medium" style={{ color: `var(${colorVar})` }}>{score}%</span>
      </div>
      <div 
        style={{
          height: '8px',
          backgroundColor: 'var(--color-surface-hover)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            height: '100%',
            width: `${fill}%`,
            backgroundColor: `var(${colorVar})`,
            transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 'var(--radius-full)'
          }}
        />
      </div>
    </div>
  );
}
