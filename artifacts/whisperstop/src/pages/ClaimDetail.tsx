import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { formatDate } from '../logic/formatDate';
import { VerdictBadge } from '../components/VerdictBadge';
import { VerdictStamp } from '../components/VerdictStamp';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { Skeleton } from '../components/Skeleton';
import { Download, ExternalLink, Shield } from 'lucide-react';
import { FactCheckCard } from '../components/FactCheckCard';
import { generateCard } from '../logic/cardGenerator';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function ClaimDetail() {
  const { claimId } = useParams();
  const { claims, verdicts } = useData();
  const [loading, setLoading] = useState(true);
  
  const claim = claims.find(c => c.id === claimId);
  const claimVerdicts = verdicts[claimId || ''] || [];

  useEffect(() => {
    // Simulate load
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [claimId]);

  if (!claim && !loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Claim not found.</div>;
  }

  const isPending = claim?.status === 'pending';
  const isContested = claim?.status === 'contested';
  
  const handleDownload = () => {
    if (claim) generateCard(claim.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative">
      {/* Hidden FactCheckCard for export */}
      {claim && !isPending && <FactCheckCard claim={claim} verdicts={claimVerdicts} />}

      <div className="mb-6 flex items-center gap-3">
        <Link to="/dashboard" className="text-sm text-secondary hover:text-text">&larr; Back</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Claim Content */}
        <div className="md:col-span-7">
          <div className="flex gap-3 items-center mb-6">
            {loading ? <Skeleton style={{ width: '80px', height: '24px' }} /> : <span className="tag">{claim.category}</span>}
            {loading ? <Skeleton style={{ width: '120px', height: '18px' }} /> : <span className="data-text text-muted">{formatDate(claim.createdAt)}</span>}
          </div>

          <div className="card mb-8 relative">
            {/* Status dot */}
            {!loading && (
              <div 
                className="absolute top-4 right-4 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: isPending ? 'var(--verdict-pending)' : (claim.verdict === 'TRUE' ? 'var(--verdict-true)' : (claim.verdict === 'FALSE' ? 'var(--verdict-false)' : (claim.verdict === 'MISLEADING' ? 'var(--verdict-misleading)' : 'var(--color-text-muted)')))
                }}
              />
            )}
            
            <div className="text-secondary text-sm mb-4 font-medium uppercase tracking-wider">The Claim</div>
            
            {loading ? (
              <div className="space-y-3">
                <Skeleton style={{ width: '100%', height: '32px' }} />
                <Skeleton style={{ width: '90%', height: '32px' }} />
                <Skeleton style={{ width: '60%', height: '32px' }} />
              </div>
            ) : (
              <>
                {claim.imageUrl && (
                  <img src={claim.imageUrl} alt="Claim forward" className="w-full max-h-64 object-contain rounded mb-4" />
                )}
                <h2 className="mb-4 leading-tight">{claim.text || claim.extractedText}</h2>
                <div className="flex items-center gap-2 mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <Shield size={16} className="text-muted" />
                  <span className="body-small text-muted">Submitted by {claim.submitterName}</span>
                </div>
              </>
            )}
          </div>

          {/* Sources Section */}
          {!loading && !isPending && claimVerdicts.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4">Verification Sources</h3>
              <div className="flex flex-col gap-3">
                {claimVerdicts.map((v, i) => (
                  <div key={i} className="card py-3 px-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <VerdictBadge verdict={v.verdict} size="sm" />
                        <span className="data-text-medium">{new URL(v.sourceUrl).hostname}</span>
                      </div>
                      <p className="body-small text-secondary">{v.explanation}</p>
                    </div>
                    <a href={v.sourceUrl} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-hover p-2">
                      <ExternalLink size={18} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Verdict */}
        <div className="md:col-span-5">
          <div className="sticky top-24">
            {loading ? (
              <div className="card h-64 flex flex-col justify-center items-center">
                <LoadingSpinner />
              </div>
            ) : isPending ? (
              <div className="card text-center">
                <h3 className="mb-6">Verification in Progress</h3>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>Community Verifiers</span>
                  <span className="data-text text-accent">{claim.verificationCount}/3</span>
                </div>
                <div className="h-2 rounded-full mb-8 bg-surface-hover overflow-hidden" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                  <div 
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${(claim.verificationCount / 3) * 100}%`, backgroundColor: 'var(--verdict-pending)' }}
                  />
                </div>
                <p className="text-secondary body-small mb-6">Awaiting 3 trusted verifiers to reach consensus before publishing a verdict.</p>
                <Link to={`/verify/${claim.id}`} className="btn btn-primary w-full justify-center">
                  Be a Verifier
                </Link>
              </div>
            ) : isContested ? (
              <div className="card">
                <div className="flex items-center gap-3 mb-4 text-muted">
                  <Shield size={24} />
                  <h3 className="m-0">Contested</h3>
                </div>
                <p className="text-secondary mb-4">Verifiers could not reach a clear consensus, or credible sources actively contradict each other. This claim remains unverifiable.</p>
                <ConfidenceBar score={claim.confidenceScore} />
              </div>
            ) : (
              <div className="card text-center flex flex-col items-center">
                <div className="text-secondary text-sm mb-8 font-medium uppercase tracking-wider">Final Verdict</div>
                
                <div className="mb-8">
                  <VerdictStamp verdict={claim.verdict} claimId={claim.id} />
                </div>
                
                <div className="w-full text-left mb-8 border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
                  <ConfidenceBar score={claim.confidenceScore} />
                  <p className="body-small text-secondary mt-3">
                    Based on {claim.verificationCount} independent verifications and source credibility.
                  </p>
                </div>

                <button onClick={handleDownload} className="btn btn-outline w-full justify-center">
                  <Download size={18} />
                  Download Fact-Check Card
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
