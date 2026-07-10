import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Image, Type, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { checkDuplicate } from '../logic/duplicateDetection';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { clsx } from 'clsx';

export default function Submit() {
  const { user } = useAuth();
  const { claims, addClaim } = useData();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('other');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<any>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length < 10) return;
    
    setLoading(true);
    setDuplicateResult(null);
    
    setTimeout(() => {
      const dup = checkDuplicate(text, claims);
      if (dup.isDuplicate) {
        setDuplicateResult(dup);
        setLoading(false);
      } else {
        const newClaim = {
          id: 'c' + Date.now(),
          text,
          imageUrl: null,
          extractedText: null,
          submittedBy: user?.uid,
          submitterName: 'Anonymous User',
          status: 'pending',
          verdict: null,
          confidenceScore: null,
          category,
          verificationCount: 0,
          createdAt: new Date().toISOString(),
          verifiedAt: null,
          viewCount: 0,
          isUrgent: false,
        };
        addClaim(newClaim);
        setSuccessId(newClaim.id);
        setLoading(false);
      }
    }, 800);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setImageError('File must be less than 5MB.');
      return;
    }
    
    setImageError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setExtractedText('');
    setDuplicateResult(null);
  };

  const extractText = () => {
    setExtracting(true);
    setTimeout(() => {
      setExtractedText('This is a simulated extracted text from the image forward. Government announced free solar panels for everyone.');
      setExtracting(false);
    }, 1200);
  };

  const handleImageSubmit = () => {
    if (!extractedText) return;
    
    setLoading(true);
    setTimeout(() => {
      const dup = checkDuplicate(extractedText, claims);
      if (dup.isDuplicate) {
        setDuplicateResult(dup);
        setLoading(false);
      } else {
        const newClaim = {
          id: 'c' + Date.now(),
          text: null,
          imageUrl: imagePreview,
          extractedText,
          submittedBy: user?.uid,
          submitterName: 'Anonymous User',
          status: 'pending',
          verdict: null,
          confidenceScore: null,
          category,
          verificationCount: 0,
          createdAt: new Date().toISOString(),
          verifiedAt: null,
          viewCount: 0,
          isUrgent: false,
        };
        addClaim(newClaim);
        setSuccessId(newClaim.id);
        setLoading(false);
      }
    }, 800);
  };

  if (successId) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="card text-center max-w-lg w-full">
          <div className="flex justify-center mb-6 text-accent">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="mb-4">Forward Submitted!</h2>
          <p className="text-secondary mb-8">
            Your forward has been added to the verification queue. The community will review it shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Link to={`/claim/${successId}`} className="btn btn-primary w-full justify-center">View Claim Details</Link>
            <button onClick={() => { setSuccessId(null); setText(''); setExtractedText(''); setImagePreview(null); }} className="btn btn-outline w-full justify-center">Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="mb-2">Check a Forward</h1>
      <p className="text-secondary mb-8">Submit a suspicious message or image from WhatsApp for community verification.</p>

      {duplicateResult && (
        <div className="mb-8 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>
          <AlertCircle className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Already Checked!</h4>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text)' }}>This forward looks exactly like one we already track (Similarity: {duplicateResult.score}%).</p>
            <Link to={`/claim/${duplicateResult.matchedClaimId}`} className="font-medium underline">
              View the existing verdict &rarr;
            </Link>
          </div>
        </div>
      )}

      <div className="mb-6 flex border-b relative" style={{ borderColor: 'var(--color-border)' }}>
        <button 
          className={clsx("pb-3 px-4 font-medium flex items-center gap-2 relative z-10", tab === 'text' ? 'text-accent' : 'text-secondary')}
          onClick={() => setTab('text')}
        >
          <Type size={18} /> Text Forward
        </button>
        <button 
          className={clsx("pb-3 px-4 font-medium flex items-center gap-2 relative z-10", tab === 'image' ? 'text-accent' : 'text-secondary')}
          onClick={() => setTab('image')}
        >
          <Image size={18} /> Image Forward
        </button>
        
        {/* Tab Indicator */}
        <div 
          className="absolute bottom-0 h-0.5 bg-accent" 
          style={{ 
            backgroundColor: 'var(--color-accent)',
            width: tab === 'text' ? '140px' : '150px',
            transform: tab === 'text' ? 'translateX(0)' : 'translateX(140px)',
            transition: 'transform var(--transition-base), width var(--transition-base)'
          }} 
        />
      </div>

      <div className="card glass-panel">
        {tab === 'text' ? (
          <form onSubmit={handleTextSubmit}>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="label m-0">Paste text here</label>
                <span className="text-xs text-muted font-mono">{text.length} chars</span>
              </div>
              <textarea 
                className="input" 
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. UNESCO has declared Indian National Anthem as best in the world..."
              />
            </div>
            
            <div className="mb-8 max-w-xs">
              <label className="label">Category</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="political">Political</option>
                <option value="health">Health / Medical</option>
                <option value="financial">Financial / Scam</option>
                <option value="religious">Religious</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full md:w-auto"
              disabled={text.length < 10 || loading}
            >
              {loading ? <LoadingSpinner size={20} /> : 'Check This Forward'}
            </button>
          </form>
        ) : (
          <div>
            {!imagePreview ? (
              <div 
                className="border-2 border-dashed rounded-lg p-12 text-center flex flex-col items-center mb-6"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              >
                <Upload size={40} className="text-muted mb-4" />
                <p className="mb-4 text-secondary">Drop a screenshot here, or click to browse</p>
                <label className="btn btn-outline cursor-pointer">
                  Browse Files
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {imageError && <p className="text-danger mt-4 text-sm">{imageError}</p>}
                <p className="text-muted text-xs mt-4">Max size: 5MB. Client-side processing only.</p>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Image Preview</span>
                  <button onClick={() => { setImagePreview(null); setImageFile(null); setExtractedText(''); }} className="text-sm text-muted hover:text-text">Remove</button>
                </div>
                <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-lg border bg-bg" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }} />
                
                {!extractedText && !extracting && (
                  <button onClick={extractText} className="btn btn-outline w-full mt-4">
                    Extract Text & Check
                  </button>
                )}
                
                {extracting && (
                  <div className="mt-4 p-6 text-center border rounded-lg bg-bg flex flex-col items-center gap-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                    <LoadingSpinner />
                    <span className="text-secondary">Extracting text from image (simulated OCR)...</span>
                  </div>
                )}
                
                {extractedText && (
                  <div className="mt-6">
                    <label className="label">Extracted Text</label>
                    <textarea 
                      className="input mb-4" 
                      rows={4}
                      value={extractedText}
                      onChange={(e) => setExtractedText(e.target.value)}
                    />
                    
                    <div className="mb-6 max-w-xs">
                      <label className="label">Category</label>
                      <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="political">Political</option>
                        <option value="health">Health / Medical</option>
                        <option value="financial">Financial / Scam</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={handleImageSubmit} 
                      className="btn btn-primary w-full md:w-auto"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size={20} /> : 'Confirm & Submit'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
