import React from 'react';
import { useData } from '../context/DataContext';
import { mockTrending, mockUsers } from '../data/mockData';
import { ClaimCard } from '../components/ClaimCard';
import { formatDate } from '../logic/formatDate';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { claims } = useData();

  const verified = claims.filter(c => c.status === 'verified');
  
  // Compute charts data
  const verdictCounts = verified.reduce((acc, c) => {
    acc[c.verdict] = (acc[c.verdict] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'FALSE', value: verdictCounts['FALSE'] || 0, color: '#ef4444' },
    { name: 'TRUE', value: verdictCounts['TRUE'] || 0, color: '#22c55e' },
    { name: 'MISLEADING', value: verdictCounts['MISLEADING'] || 0, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const topDebunked = verified
    .filter(c => c.verdict === 'FALSE' || c.verdict === 'MISLEADING')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const topVerifiers = [...mockUsers]
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Trending Misinformation This Week</h1>
        <p className="text-secondary data-text">
          {new Date(mockTrending.weekStart).toLocaleDateString()} — {new Date(mockTrending.weekEnd).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card glass-panel border-l-4" style={{ borderLeftColor: 'var(--color-border)' }}>
          <div className="card-deco">SEC:01</div>
          <div className="text-xs font-medium text-secondary mb-2 uppercase tracking-wider font-mono">Total Claims Processed</div>
          <div className="text-4xl font-bold font-display text-text">{claims.length}</div>
        </div>
        <div className="card glass-panel border-l-4" style={{ borderLeftColor: 'var(--verdict-false)' }}>
          <div className="card-deco">SEC:02</div>
          <div className="text-xs font-medium text-secondary mb-2 uppercase tracking-wider font-mono">False & Misleading</div>
          <div className="text-4xl font-bold font-display text-danger">{verified.filter(c => c.verdict === 'FALSE' || c.verdict === 'MISLEADING').length}</div>
        </div>
        <div className="card glass-panel border-l-4" style={{ borderLeftColor: 'var(--verdict-true)' }}>
          <div className="card-deco">SEC:03</div>
          <div className="text-xs font-medium text-secondary mb-2 uppercase tracking-wider font-mono">Verified True</div>
          <div className="text-4xl font-bold font-display" style={{ color: 'var(--verdict-true)' }}>{verified.filter(c => c.verdict === 'TRUE').length}</div>
        </div>
        <div className="card glass-panel border-l-4" style={{ borderLeftColor: 'var(--verdict-pending)' }}>
          <div className="card-deco">SEC:04</div>
          <div className="text-xs font-medium text-secondary mb-2 uppercase tracking-wider font-mono">Awaiting Verifiers</div>
          <div className="text-4xl font-bold font-display" style={{ color: 'var(--verdict-pending)' }}>{claims.filter(c => c.status === 'pending').length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Chart */}
        <div className="card lg:col-span-1 flex flex-col relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="font-mono text-6xl font-bold">01</span>
          </div>
          <div className="card-deco">CHART_SYS</div>
          <h3 className="mb-6 relative z-10 text-gradient">Verdict Breakdown</h3>
          <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
            {(() => {
              const total = chartData.reduce((sum, d) => sum + d.value, 0);
              const isEmpty = total === 0;
              let cursor = 0;
              const stops = isEmpty
                ? `var(--color-border) 0deg 360deg`
                : chartData.map(d => {
                    const start = (cursor / total) * 360;
                    cursor += d.value;
                    const end = (cursor / total) * 360;
                    return `${d.color} ${start}deg ${end}deg`;
                  }).join(', ');
              return (
                <div
                  role="img"
                  aria-label={isEmpty ? 'Verdict breakdown donut chart, 0 claims' : `Verdict breakdown donut chart, ${total} claims`}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `conic-gradient(${stops})`,
                    boxShadow: 'var(--shadow-md)',
                    position: 'relative',
                    opacity: isEmpty ? 0.5 : 1,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      margin: 'auto',
                      width: 110,
                      height: 110,
                      borderRadius: '50%',
                      background: 'var(--color-surface)',
                      border: '2px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="text-2xl font-bold font-display">{total}</span>
                    <span className="data-text text-secondary" style={{ fontSize: 9 }}>Claims</span>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {chartData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Debunked */}
        <div className="card lg:col-span-2 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="font-mono text-6xl font-bold">02</span>
          </div>
          <div className="card-deco">TOP_ALERTS</div>
          <h3 className="mb-6 relative z-10 text-gradient">Top 5 Debunked Forwards</h3>
          <div className="flex flex-col gap-4">
            {topDebunked.map((claim, idx) => (
              <div key={claim.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors border border-transparent" style={{ borderColor: 'transparent' }} onMouseEnter={e=>{e.currentTarget.style.backgroundColor='var(--color-surface-hover)'; e.currentTarget.style.borderColor='var(--color-border)'}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.borderColor='transparent'}}>
                <div className="text-xl font-bold font-mono text-muted mt-1 w-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                  0{idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-lg leading-tight mb-1">
                    <Link to={`/claim/${claim.id}`} className="hover:underline">"{claim.text || 'Image'}"</Link>
                  </h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-secondary">{claim.viewCount} views</span>
                    <span className="text-danger font-medium">{claim.verdict}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Verifiers */}
        <div className="card relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="font-mono text-6xl font-bold">03</span>
          </div>
          <div className="card-deco">OP_ROSTER</div>
          <h3 className="mb-6 relative z-10 text-gradient">Top Verifiers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-2 font-medium text-secondary">User</th>
                  <th className="py-3 px-2 font-medium text-secondary text-right">Reputation</th>
                  <th className="py-3 px-2 font-medium text-secondary text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {topVerifiers.map(u => (
                  <tr key={u.uid} className="border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="py-3 px-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                        {u.displayName.charAt(0)}
                      </div>
                      <span className="font-medium">{u.displayName}</span>
                    </td>
                    <td className="py-3 px-2 text-right data-text font-bold text-accent">{u.reputation}</td>
                    <td className="py-3 px-2 text-right data-text text-secondary">
                      {u.totalVerifications > 0 ? Math.round((u.correctVerifications / u.totalVerifications) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="card relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="font-mono text-6xl font-bold">04</span>
          </div>
          <div className="card-deco">ACT_LOG</div>
          <h3 className="mb-6 relative z-10 text-gradient">Recent Activity</h3>
          <div className="relative pl-6 border-l-2 ml-3" style={{ borderColor: 'var(--color-border)' }}>
            {verified.slice(0, 5).map((c, i) => (
              <div key={c.id} className="mb-6 relative">
                <div 
                  className="absolute w-3 h-3 rounded-full bg-surface border-2 -left-[31px] top-1" 
                  style={{ 
                    borderColor: c.verdict === 'TRUE' ? 'var(--verdict-true)' : 'var(--verdict-false)',
                    backgroundColor: 'var(--color-bg)' 
                  }}
                />
                <p className="data-text text-muted mb-1">{formatDate(c.verifiedAt)}</p>
                <p className="text-sm">
                  <span className="font-medium text-text">Community</span> verified a claim as <strong style={{ color: c.verdict === 'TRUE' ? 'var(--verdict-true)' : 'var(--verdict-false)' }}>{c.verdict}</strong>
                </p>
                <Link to={`/claim/${c.id}`} className="text-sm text-secondary truncate block mt-1 hover:text-accent max-w-sm">
                  "{c.text}"
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
