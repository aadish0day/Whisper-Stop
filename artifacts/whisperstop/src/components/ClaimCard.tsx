import React from 'react';
import { Link } from 'react-router-dom';
import { VerdictBadge } from './VerdictBadge';
import { ConfidenceBar } from './ConfidenceBar';
import { formatDate } from '../logic/formatDate';

interface ClaimCardProps {
  claim: any;
}

export function ClaimCard({ claim }: ClaimCardProps) {
  const isPending = claim.status === 'pending';

  return (
    <Link 
      to={isPending ? `/verify/${claim.id}` : `/claim/${claim.id}`}
      className="card flex flex-col justify-between"
      style={{
        display: 'flex',
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-base), background-color var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        e.currentTarget.style.borderColor = 'var(--card-hover-border)';
        e.currentTarget.style.transform = 'translate(-4px, -4px)';
        e.currentTarget.style.boxShadow = '12px 12px 0 var(--color-border)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      <div className="card-deco">REF:{claim.id.slice(0, 8)}</div>
      <div>
        <div className="flex justify-between items-start mb-4 gap-3">
          <VerdictBadge verdict={claim.verdict} size="sm" />
          <span className="tag">{claim.category}</span>
        </div>
        
        <h3 className="mb-4 font-body font-medium leading-tight" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '17px'
        }}>
          "{claim.text || 'Image Forward'}"
        </h3>
      </div>
      
      <div className="pt-4 mt-auto border-t" style={{ borderColor: 'var(--color-border)' }}>
        {!isPending && <ConfidenceBar score={claim.confidenceScore} />}
        
        <div className="flex justify-between items-center mt-4">
          <span className="data-text text-muted">{formatDate(claim.createdAt)}</span>
          {!isPending && (
            <span className="data-text text-muted">{claim.viewCount} VIEWS</span>
          )}
          {isPending && (
            <span className="data-text font-medium text-accent">{claim.verificationCount}/3 REQ</span>
          )}
        </div>
      </div>
    </Link>
  );
}
