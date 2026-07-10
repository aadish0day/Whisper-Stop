import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { calculateConfidenceScore } from '../logic/confidenceScore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function VerifyDetail() {
  const { claimId } = useParams();
  const { claims, verdicts, addVerdict, updateClaim } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const claim = claims.find(c => c.id === claimId);
  const existingVerdicts = verdicts[claimId || ''] || [];
  
  // Guard logic
  const isOwnClaim = claim?.submittedBy === user?.uid;
  const hasVerified = existingVerdicts.some((v: any) => v.uid === user?.uid);

  const getSourceQuality = (url: string) => {
    if (!url) return null;
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      if (hostname.includes('who.int') || hostname.includes('gov') || hostname.includes('reuters.com')) return { label: 'High quality source', color: 'var(--verdict-true)' };
      if (hostname.includes('news') || hostname.includes('times')) return { label: 'Credible source', color: 'var(--verdict-true)' };
      return { label: 'Unverified source', color: 'var(--verdict-misleading)' };
    } catch {
      return null;
    }
  };

  const sourceBadge = getSourceQuality(sourceUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verdict) { setError('Please select a verdict.'); return; }
    if (!sourceUrl || !sourceUrl.startsWith('http')) { setError('Please provide a valid source URL.'); return; }
    if (explanation.length < 50) { setError('Explanation must be at least 50 characters.'); return; }
    
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const newVerdict = {
        uid: user?.uid,
        verdict,
        sourceUrl,
        explanation,
        verifierReputation: user?.reputation || 50,
        submittedAt: new Date().toISOString()
      };
      
      addVerdict(claim.id, newVerdict);
      
      const newCount = claim.verificationCount + 1;
      
      // If reached 3, resolve
      if (newCount >= 3) {
        const allVerdicts = [...existingVerdicts, newVerdict];
        const result = calculateConfidenceScore(allVerdicts);
        
        updateClaim(claim.id, {
          verificationCount: newCount,
          status: result.consensusVerdict === 'UNVERIFIABLE' ? 'contested' : 'verified',
          verdict: result.consensusVerdict,
          confidenceScore: result.score,
          verifiedAt: new Date().toISOString()
        });
        
        setToast('Consensus reached! Claim has been published.');
      } else {
        updateClaim(claim.id, { verificationCount: newCount });
        setToast('Verdict submitted successfully.');
      }
      
      setTimeout(() => {
        navigate('/verify');
      }, 1500);
      
    }, 800);
  };

  if (!claim) return <div className="p-8 text-center">Claim not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-surface px-6 py-4 rounded-lg shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--verdict-true)', color: 'var(--verdict-true)' }}>
          <CheckCircle2 />
          <span className="font-medium">{toast}</span>
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="mb-2">Verify Claim</h1>
        <p className="text-secondary">Provide evidence to help establish a consensus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: The Claim */}
        <div className="card h-fit relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-5 z-0 pointer-events-none" />
          <div className="text-secondary text-xs mb-4 font-mono font-medium uppercase tracking-wider relative z-10">The Forward</div>
          {claim.imageUrl && <img src={claim.imageUrl} alt="Claim" className="w-full rounded-lg mb-4 object-contain max-h-64 border bg-bg relative z-10" style={{ borderColor: 'var(--color-border)' }} />}
          <h2 className="mb-4 relative z-10 font-body text-2xl font-medium">"{claim.text || claim.extractedText}"</h2>
          <div className="mt-6 pt-4 border-t flex justify-between relative z-10" style={{ borderColor: 'var(--color-border)' }}>
            <span className="tag">{claim.category}</span>
            <span className="data-text text-muted">ID: {claim.id}</span>
          </div>
        </div>

        {/* Right: The Form */}
        <div>
          {isOwnClaim || hasVerified ? (
            <div className="card p-6 border-l-4" style={{ borderLeftColor: 'var(--verdict-misleading)' }}>
              <div className="flex items-start gap-3 text-secondary">
                <AlertCircle className="shrink-0 mt-1" style={{ color: 'var(--verdict-misleading)' }} />
                <div>
                  <h3 className="mb-2 text-text">Cannot Verify</h3>
                  <p className="body-small">
                    {isOwnClaim ? "You cannot verify a claim you submitted to ensure impartiality." : "You have already submitted a verdict for this claim."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card">
              <div className="mb-6 p-4 rounded-md bg-surface-hover body-small text-secondary" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                <strong>Rules:</strong> Base your verdict strictly on factual evidence. Use primary sources when possible. Personal opinions will reduce your reputation score if contested.
              </div>
              
              <div className="mb-8">
                <label className="label mb-3">Your Verdict</label>
                <div className="grid grid-cols-2 gap-3">
                  {['TRUE', 'FALSE', 'MISLEADING', 'UNVERIFIABLE'].map(v => {
                    let cv = '--verdict-pending';
                    if (v === 'TRUE') cv = '--verdict-true';
                    if (v === 'FALSE') cv = '--verdict-false';
                    if (v === 'MISLEADING') cv = '--verdict-misleading';
                    if (v === 'UNVERIFIABLE') cv = '--verdict-unverifiable';
                    
                    const isSelected = verdict === v;
                    return (
                      <label 
                        key={v}
                        className={clsx(
                          "border rounded-md p-3 text-center cursor-pointer font-medium transition-colors",
                          isSelected ? "" : "hover:bg-surface-hover"
                        )}
                        style={{
                          borderColor: isSelected ? `var(${cv})` : 'var(--color-border)',
                          backgroundColor: isSelected ? `color-mix(in srgb, var(${cv}) 10%, transparent)` : 'transparent',
                          color: isSelected ? `var(${cv})` : 'var(--color-text)'
                        }}
                      >
                        <input type="radio" name="verdict" className="hidden" checked={isSelected} onChange={() => setVerdict(v)} />
                        {v}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Source URL</label>
                <input 
                  type="url" 
                  className="input mb-2" 
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  placeholder="https://"
                />
                {sourceBadge && (
                  <div className="text-xs font-medium" style={{ color: sourceBadge.color }}>
                    {sourceBadge.label}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <label className="label">Explanation</label>
                  <span className="text-xs font-mono text-muted">{explanation.length} / 50 min</span>
                </div>
                <textarea 
                  className="input" 
                  rows={4}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Explain why the claim is true or false based on the source provided..."
                />
              </div>

              {error && <div className="mb-4 text-sm font-medium text-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <LoadingSpinner size={20} /> : 'Submit Verdict'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
