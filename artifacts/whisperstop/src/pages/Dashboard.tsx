import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
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
    { name: 'FALSE', value: verdictCounts['FALSE'] || 0, color: 'var(--verdict-false)' },
    { name: 'TRUE', value: verdictCounts['TRUE'] || 0, color: 'var(--verdict-true)' },
    { name: 'MISLEADING', value: verdictCounts['MISLEADING'] || 0, color: 'var(--verdict-misleading)' },
  ].filter(d => d.value > 0);

  const topDebunked = verified
    .filter(c => c.verdict === 'FALSE' || c.verdict === 'MISLEADING')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const topVerifiers = [...mockUsers]
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-3 shadow-lg" style={{ border: '1px solid var(--color-border)' }}>
          <p className="font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">📊 Trending Misinformation This Week</h1>
        <p className="text-secondary data-text">
          {new Date(mockTrending.weekStart).toLocaleDateString()} — {new Date(mockTrending.weekEnd).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card border-l-4" style={{ borderLeftColor: 'var(--color-accent)' }}>
          <div className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">Total Claims Processed</div>
          <div className="text-3xl font-bold font-mono">{claims.length}</div>
        </div>
        <div className="card border-l-4" style={{ borderLeftColor: 'var(--verdict-false)' }}>
          <div className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">False & Misleading</div>
          <div className="text-3xl font-bold font-mono">{verified.filter(c => c.verdict === 'FALSE' || c.verdict === 'MISLEADING').length}</div>
        </div>
        <div className="card border-l-4" style={{ borderLeftColor: 'var(--verdict-true)' }}>
          <div className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">Verified True</div>
          <div className="text-3xl font-bold font-mono">{verified.filter(c => c.verdict === 'TRUE').length}</div>
        </div>
        <div className="card border-l-4" style={{ borderLeftColor: 'var(--verdict-pending)' }}>
          <div className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">Awaiting Verification</div>
          <div className="text-3xl font-bold font-mono">{claims.filter(c => c.status === 'pending').length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Chart */}
        <div className="card lg:col-span-1 flex flex-col">
          <h3 className="mb-6">Verdict Breakdown</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
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
        <div className="card lg:col-span-2">
          <h3 className="mb-6">Top 5 Debunked Forwards</h3>
          <div className="flex flex-col gap-4">
            {topDebunked.map((claim, idx) => (
              <div key={claim.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors" style={{ backgroundColor: 'transparent' }} onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--color-surface-hover)'} onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                <div className="text-2xl font-bold font-mono text-muted opacity-50 mt-1">
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
        <div className="card">
          <h3 className="mb-6">Top Verifiers</h3>
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
        <div className="card">
          <h3 className="mb-6">Recent Activity</h3>
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
