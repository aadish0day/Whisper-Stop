import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, AlertOctagon, Download } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { formatDate } from '../logic/formatDate';
import { mockTrending } from '../data/mockData';

export default function AdminPanel() {
  const { claims, updateClaim, deleteClaim } = useData();
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredClaims = claims
    .filter(c => filter === 'all' ? true : c.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMarkUrgent = (id: string, current: boolean) => {
    updateClaim(id, { isUrgent: !current });
  };

  const executeDelete = (id: string) => {
    deleteClaim(id);
    setConfirmDelete(null);
  };

  const handleReport = () => {
    alert(`Report generated! Total verified this week: ${mockTrending.totalVerified}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="mb-2">Admin Panel</h1>
          <p className="text-secondary">Manage claims, moderation, and reports.</p>
        </div>
        <button onClick={handleReport} className="btn btn-primary">
          <Download size={18} /> Generate Weekly Report
        </button>
      </div>

      <div className="card mb-8 flex gap-4 overflow-x-auto">
        <button 
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >All Claims</button>
        <button 
          onClick={() => setFilter('pending')}
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
        >Pending</button>
        <button 
          onClick={() => setFilter('verified')}
          className={`btn ${filter === 'verified' ? 'btn-primary' : 'btn-outline'}`}
        >Verified</button>
        <button 
          onClick={() => setFilter('contested')}
          className={`btn ${filter === 'contested' ? 'btn-primary' : 'btn-outline'}`}
        >Contested</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead style={{ backgroundColor: 'var(--color-surface-hover)' }}>
              <tr>
                <th className="py-4 px-4 font-medium text-secondary">ID / Date</th>
                <th className="py-4 px-4 font-medium text-secondary">Claim snippet</th>
                <th className="py-4 px-4 font-medium text-secondary">Status</th>
                <th className="py-4 px-4 font-medium text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <EmptyState icon={AlertOctagon} title="No claims found" message="No claims match this filter." />
                  </td>
                </tr>
              ) : (
                filteredClaims.map(claim => (
                  <tr key={claim.id} className="border-b last:border-0 hover:bg-surface-hover" style={{ borderColor: 'var(--color-border)', transition: 'background-color var(--transition-fast)' }} onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--color-surface-hover)'} onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                    <td className="py-4 px-4 align-top">
                      <div className="data-text font-medium">{claim.id}</div>
                      <div className="body-small text-muted">{formatDate(claim.createdAt)}</div>
                    </td>
                    <td className="py-4 px-4 align-top max-w-xs">
                      <div className="line-clamp-2 text-sm">{claim.text || 'Image Forward'}</div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="tag mb-2 inline-block">{claim.status}</span>
                      {claim.isUrgent && <div className="text-xs font-bold text-danger">URGENT</div>}
                    </td>
                    <td className="py-4 px-4 align-top text-right">
                      {confirmDelete === claim.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => executeDelete(claim.id)} className="btn btn-primary" style={{ backgroundColor: 'var(--verdict-false)', color: 'white' }}>Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} className="btn btn-outline">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleMarkUrgent(claim.id, claim.isUrgent)}
                            className="btn-icon" 
                            style={{ color: claim.isUrgent ? 'var(--verdict-false)' : 'var(--color-text-secondary)' }}
                            title={claim.isUrgent ? 'Remove Urgent' : 'Mark Urgent'}
                          >
                            <AlertOctagon size={18} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(claim.id)}
                            className="btn-icon text-secondary hover:text-danger" 
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
