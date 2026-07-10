import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, ShieldCheck, Share2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ClaimCard } from '../components/ClaimCard';
import { mockTrending, mockUsers } from '../data/mockData';

export default function Home() {
  const { claims } = useData();
  
  const verifiedClaims = claims
    .filter(c => c.status === 'verified')
    .sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime())
    .slice(0, 6);

  const falseCount = claims.filter(c => c.verdict === 'FALSE').length;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-32 overflow-hidden hero-pattern"
      >
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at top center, color-mix(in srgb, var(--color-accent) 15%, transparent) 0%, var(--color-bg) 70%)',
          zIndex: 0
        }} />
        <div className="container mx-auto px-4 text-center relative z-10 animate-in fade-in slide-in-from-top-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8 glass" style={{ borderColor: 'var(--color-border)' }}>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
            <span className="data-text">Community Immune System</span>
          </div>
          <h1 className="mb-6 max-w-4xl mx-auto tracking-tight" style={{ whiteSpace: 'pre-line' }}>
            <span className="text-gradient">Stop Misinformation.</span>{"\n"}
            <span className="text-text">One Forward at a Time.</span>
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A community-powered platform to verify WhatsApp forwards, catch fake news early, and share irrefutable fact-check cards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/submit" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>
              Check a Forward &rarr;
            </Link>
            <Link to="/dashboard" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '18px' }}>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="container mx-auto px-4 py-8 relative z-10 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card glass-panel text-center animate-in fade-in slide-in-up stagger-1">
            <div className="card-deco">STAT:01</div>
            <div className="data-text mb-2 text-secondary">TOTAL CLAIMS VERIFIED</div>
            <div className="text-4xl font-bold text-accent font-display">
              {mockTrending.totalVerified}
            </div>
          </div>
          <div className="card glass-panel text-center animate-in fade-in slide-in-up stagger-2">
            <div className="card-deco">STAT:02</div>
            <div className="data-text mb-2 text-secondary">TOTAL VERIFIERS</div>
            <div className="text-4xl font-bold text-accent font-display">
              {mockUsers.length}
            </div>
          </div>
          <div className="card glass-panel text-center animate-in fade-in slide-in-up stagger-3">
            <div className="card-deco">STAT:03</div>
            <div className="data-text mb-2 text-secondary">FALSE CLAIMS CAUGHT</div>
            <div className="text-4xl font-bold text-danger font-display">
              {falseCount}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Verified Claims */}
      <section className="container mx-auto px-4 py-16 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="mb-2">Recently Verified</h2>
            <p className="text-secondary">The latest verdicts from the community.</p>
          </div>
          <Link to="/dashboard" className="text-accent font-medium hover:underline hidden md:block">
            View all trending
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedClaims.map(claim => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/dashboard" className="btn btn-outline w-full justify-center">
            View all trending
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 mb-16 rounded-3xl relative overflow-hidden glass-panel" style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 40%, transparent)' }}>
        <div className="absolute inset-0 hero-pattern opacity-50 z-0 pointer-events-none" />
        <div className="text-center mb-12 relative z-10">
          <h2 className="mb-4 text-gradient">How WhisperStop Works</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            We turn questionable forwards into verified facts using community consensus and transparent sourcing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative">
          {/* Connector Line on Desktop */}
          <div 
            className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 z-0" 
            style={{ backgroundColor: 'var(--color-border)' }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 bg-bg flex items-center justify-center rounded-full" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-bg)', border: '2px solid var(--color-border)' }}>
              <MessageSquare size={32} className="text-accent" />
            </div>
            <h3 className="mb-2">1. Paste Forward</h3>
            <p className="text-secondary body-small">Submit any suspicious text or image forward from WhatsApp.</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 bg-bg flex items-center justify-center rounded-full" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-bg)', border: '2px solid var(--color-border)' }}>
              <Users size={32} className="text-accent" />
            </div>
            <h3 className="mb-2">2. Community Verifies</h3>
            <p className="text-secondary body-small">Trusted verifiers review the claim and provide credible sources.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 bg-bg flex items-center justify-center rounded-full" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-bg)', border: '2px solid var(--color-border)' }}>
              <ShieldCheck size={32} className="text-accent" />
            </div>
            <h3 className="mb-2">3. Verdict Published</h3>
            <p className="text-secondary body-small">A consensus score and clear verdict are stamped on the claim.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 bg-bg flex items-center justify-center rounded-full" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-bg)', border: '2px solid var(--color-border)' }}>
              <Share2 size={32} className="text-accent" />
            </div>
            <h3 className="mb-2">4. Share Card</h3>
            <p className="text-secondary body-small">Download a fact-check card to reply back to the WhatsApp group.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
