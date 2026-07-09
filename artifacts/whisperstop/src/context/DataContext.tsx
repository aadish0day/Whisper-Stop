import React, { createContext, useContext, useState } from 'react';
import { mockClaims, mockVerdicts } from '../data/mockData';

interface DataContextType {
  claims: any[];
  verdicts: { [claimId: string]: any[] };
  addClaim: (claim: any) => void;
  addVerdict: (claimId: string, verdict: any) => void;
  updateClaim: (claimId: string, updates: any) => void;
  deleteClaim: (claimId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<any[]>([...mockClaims]);
  const [verdicts, setVerdicts] = useState<{ [claimId: string]: any[] }>({ ...mockVerdicts });

  const addClaim = (claim: any) => {
    setClaims(prev => [claim, ...prev]);
  };

  const updateClaim = (claimId: string, updates: any) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, ...updates } : c));
  };

  const deleteClaim = (claimId: string) => {
    setClaims(prev => prev.filter(c => c.id !== claimId));
    setVerdicts(prev => {
      const copy = { ...prev };
      delete copy[claimId];
      return copy;
    });
  };

  const addVerdict = (claimId: string, verdict: any) => {
    setVerdicts(prev => {
      const existing = prev[claimId] || [];
      return { ...prev, [claimId]: [...existing, verdict] };
    });
  };

  return (
    <DataContext.Provider value={{ claims, verdicts, addClaim, updateClaim, deleteClaim, addVerdict }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
