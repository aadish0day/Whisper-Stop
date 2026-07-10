import React from 'react';
import { VerdictStamp } from './VerdictStamp';

interface FactCheckCardProps {
  claim: any;
  verdicts: any[];
}

export function FactCheckCard({ claim, verdicts }: FactCheckCardProps) {
  // Always render in a dark context for the exported image
  
  const dominantExplanation = verdicts && verdicts.length > 0 
    ? verdicts[0].explanation 
    : 'Community has verified this forward.';

  const sources = verdicts 
    ? Array.from(new Set(verdicts.map(v => new URL(v.sourceUrl).hostname))).slice(0, 2)
    : [];

  return (
    <div 
      id={`fact-check-card-${claim.id}`}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '540px',
        height: '540px',
        backgroundColor: '#0D0D14', // Force dark bg
        color: '#E2E2F0', // Force dark text
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Inter', sans-serif",
        border: '2px solid #1E1E30',
        borderRadius: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '24px' }}>🛑</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '20px', color: '#FFFFFF' }}>
            WhisperStop
          </span>
        </div>
        
        <div style={{ 
          fontSize: '24px', 
          lineHeight: '1.4', 
          fontWeight: 600, 
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: '24px',
          color: '#FFFFFF'
        }}>
          "{claim.text}"
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flex: 1,
        margin: '20px 0'
      }}>
        <VerdictStamp verdict={claim.verdict} claimId={claim.id} />
      </div>

      <div>
        {claim.confidenceScore && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px', color: '#94A3B8' }}>
              <span>Confidence</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FFFFFF' }}>{claim.confidenceScore}%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#1E1E30', borderRadius: '4px' }}>
              <div style={{ 
                height: '100%', 
                width: `${claim.confidenceScore}%`, 
                backgroundColor: claim.confidenceScore > 70 ? '#22C55E' : (claim.confidenceScore > 40 ? '#F59E0B' : '#EF4444'),
                borderRadius: '4px'
              }} />
            </div>
          </div>
        )}
        
        <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '12px', lineHeight: '1.5' }}>
          {dominantExplanation}
        </p>
        
        {sources.length > 0 && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#6B6B8A' }}>
            Sources: {sources.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
