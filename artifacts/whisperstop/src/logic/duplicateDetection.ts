import { normalizeText } from './normalizeText';

function wordSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.split(' ').filter(w => w.length > 3));
  const wordsB = new Set(textB.split(' ').filter(w => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}

export function checkDuplicate(incomingText: string, existingClaims: any[]) {
  const normalized = normalizeText(incomingText);
  let highestScore = 0;
  let matchedClaimId = null;

  existingClaims.forEach(claim => {
    const claimText = normalizeText(claim.text || claim.extractedText || '');
    const score = wordSimilarity(normalized, claimText);
    if (score > highestScore) {
      highestScore = score;
      matchedClaimId = claim.id;
    }
  });

  const DUPLICATE_THRESHOLD = 0.65;
  return {
    isDuplicate: highestScore >= DUPLICATE_THRESHOLD,
    matchedClaimId: highestScore >= DUPLICATE_THRESHOLD ? matchedClaimId : null,
    score: Math.round(highestScore * 100),
  };
}
