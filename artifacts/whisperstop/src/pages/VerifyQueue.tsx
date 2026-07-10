import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { formatDate } from '../logic/formatDate';
import { EmptyState } from '../components/EmptyState';
import { CheckCircle2 } from 'lucide-react';

export default function VerifyQueue() {
  const { claims } = useData();
  const [filter, setFilter] = useState('all');
  
  // Sort oldest first for queue
  const pendingClaims = claims
    .filter(c => c.status === 'pending')
    .filter(c => filter === 'all' ? true : c.category === filter)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="mb-2">Verify Queue</h1>
          <p className="text-secondary">Review pending claims and provide credible sources.</p>
        </div>
        
        <select 
          className="input w-full md:w-auto" 
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="political">Political</option>
          <option value="health">Health</option>
          <option value="financial">Financial</option>
          <option value="religious">Religious</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {pendingClaims.length === 0 ? (
          <div className="card py-16">
            <EmptyState 
              icon={CheckCircle2} 
              title="You're all caught up!" 
              message="No claims pending verification right now. Check back later! 🎉" 
            />
          </div>
        ) : (
          pendingClaims.map(claim => (
            <div key={claim.id} className="card p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-surface-hover" style={{
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
            >
              <div className="flex-1">
                <div className="flex gap-2 mb-3 items-center">
                  <span className="tag">{claim.category}</span>
                  {claim.isUrgent && <span className="tag" style={{ backgroundColor: 'color-mix(in srgb, var(--verdict-false) 20%, transparent)', color: 'var(--verdict-false)', borderColor: 'color-mix(in srgb, var(--verdict-false) 30%, transparent)' }}>URGENT</span>}
                </div>
                <h3 className="mb-3 text-lg sm:text-xl line-clamp-2 font-medium" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  "{claim.text || 'Image Forward'}"
                </h3>
                <div className="flex gap-4">
                  <span className="data-text text-muted">{formatDate(claim.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0" style={{ borderColor: 'var(--color-border)' }}>
                {/* Progress Ring Fake */}
                <div className="flex items-center gap-2">
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: `conic-gradient(var(--color-accent) ${(claim.verificationCount/3)*100}%, var(--color-surface-hover) 0)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="data-text text-xs">{claim.verificationCount}</span>
                    </div>
                  </div>
                  <span className="body-small text-secondary hidden sm:inline">/ 3</span>
                </div>
                
                <Link to={`/verify/${claim.id}`} className="btn btn-primary sm:ml-4 flex-1 sm:flex-none">
                  Verify This
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
