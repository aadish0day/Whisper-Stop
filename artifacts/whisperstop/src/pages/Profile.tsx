import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ClaimCard } from '../components/ClaimCard';
import { Shield, FileText, CheckSquare, Award } from 'lucide-react';
import { clsx } from 'clsx';
import { EmptyState } from '../components/EmptyState';

export default function Profile() {
  const { user } = useAuth();
  const { claims, verdicts } = useData();
  const [tab, setTab] = useState<'submissions' | 'verifications'>('submissions');

  if (!user) return null;

  const userClaims = claims.filter(c => c.submittedBy === user.uid);
  
  // Find claims the user has verified
  const verifiedClaimIds = Object.entries(verdicts)
    .filter(([_, vs]) => vs.some(v => v.uid === user.uid))
    .map(([id]) => id);
  const userVerifications = claims.filter(c => verifiedClaimIds.includes(c.id));

  const getRank = (rep: number) => {
    if (rep >= 90) return { label: 'Elite', color: 'var(--verdict-true)' };
    if (rep >= 70) return { label: 'Expert', color: 'var(--color-accent)' };
    if (rep >= 40) return { label: 'Trusted', color: 'var(--verdict-pending)' };
    return { label: 'Novice', color: 'var(--color-text-secondary)' };
  };

  const rank = getRank(user.reputation);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shrink-0 shadow-md"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <h1 className="mb-1 text-3xl">{user.displayName}</h1>
            <p className="text-secondary mb-4">{user.email}</p>
            
            <div className="max-w-md mx-auto md:mx-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium flex items-center gap-2" style={{ color: rank.color }}>
                  <Award size={18} /> {rank.label} Verifier
                </span>
                <span className="data-text-medium">{user.reputation}/100 Rep</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                <div 
                  className="h-full transition-all duration-1000"
                  style={{ width: `${user.reputation}%`, backgroundColor: rank.color }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono">{user.submittedClaims}</div>
            <div className="text-sm text-secondary uppercase tracking-wider mt-1">Submissions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono">{user.totalVerifications}</div>
            <div className="text-sm text-secondary uppercase tracking-wider mt-1">Verifications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-accent">
              {user.totalVerifications > 0 ? Math.round((user.correctVerifications / user.totalVerifications) * 100) : 0}%
            </div>
            <div className="text-sm text-secondary uppercase tracking-wider mt-1">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono">{new Date(user.joinedAt).getFullYear()}</div>
            <div className="text-sm text-secondary uppercase tracking-wider mt-1">Joined</div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex border-b relative" style={{ borderColor: 'var(--color-border)' }}>
        <button 
          className={clsx("pb-3 px-6 font-medium flex items-center gap-2 relative z-10", tab === 'submissions' ? 'text-accent' : 'text-secondary')}
          onClick={() => setTab('submissions')}
        >
          <FileText size={18} /> My Submissions ({userClaims.length})
        </button>
        <button 
          className={clsx("pb-3 px-6 font-medium flex items-center gap-2 relative z-10", tab === 'verifications' ? 'text-accent' : 'text-secondary')}
          onClick={() => setTab('verifications')}
        >
          <CheckSquare size={18} /> My Verifications ({userVerifications.length})
        </button>
        
        <div 
          className="absolute bottom-0 h-0.5 bg-accent" 
          style={{ 
            backgroundColor: 'var(--color-accent)',
            width: tab === 'submissions' ? '180px' : '190px',
            transform: tab === 'submissions' ? 'translateX(0)' : 'translateX(180px)',
            transition: 'transform var(--transition-base), width var(--transition-base)'
          }} 
        />
      </div>

      <div>
        {tab === 'submissions' && (
          userClaims.length === 0 ? (
            <div className="card py-12"><EmptyState icon={FileText} title="No Submissions Yet" message="You haven't submitted any forwards for verification." /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userClaims.map(c => <ClaimCard key={c.id} claim={c} />)}
            </div>
          )
        )}
        
        {tab === 'verifications' && (
          userVerifications.length === 0 ? (
            <div className="card py-12"><EmptyState icon={CheckSquare} title="No Verifications Yet" message="You haven't verified any claims yet. Check the Verify Queue." /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVerifications.map(c => <ClaimCard key={c.id} claim={c} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}
