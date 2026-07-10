export function calculateConfidenceScore(verdicts: any[]): { score: number, consensusVerdict: string } {
  if (verdicts.length === 0) return { score: 0, consensusVerdict: 'UNVERIFIABLE' };
  
  const counts: Record<string, number> = {};
  verdicts.forEach(v => {
    counts[v.verdict] = (counts[v.verdict] || 0) + 1;
  });
  
  let consensusVerdict = 'UNVERIFIABLE';
  let maxCount = 0;
  for (const [v, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      consensusVerdict = v;
    }
  }
  
  const agreementRatio = maxCount / verdicts.length;
  const avgReputation = verdicts.reduce((acc, v) => acc + (v.verifierReputation || 50), 0) / verdicts.length;
  
  // Basic mock formula
  const score = Math.round((agreementRatio * 40) + (avgReputation * 0.6));
  
  return {
    score: Math.min(100, Math.max(0, score)),
    consensusVerdict
  };
}
