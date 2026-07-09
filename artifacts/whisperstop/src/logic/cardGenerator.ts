import html2canvas from 'html2canvas';

export async function generateCard(claimId: string) {
  const element = document.getElementById(`fact-check-card-${claimId}`);
  if (!element) return;
  const canvas = await html2canvas(element, {
    backgroundColor: '#0D0D14', // Dark theme background for consistent export
    scale: 2,
    useCORS: true,
    width: 540,
    height: 540,
  });
  const link = document.createElement('a');
  link.download = `whisper-stop-${claimId}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
