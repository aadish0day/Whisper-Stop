import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      register(name, email);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-64px)] relative">
      <div className="absolute inset-0 hero-pattern opacity-50 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-10 z-0 pointer-events-none" />
      <div className="card glass-panel w-full relative z-10" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-8">
          <h2 className="mb-2 text-gradient">Join WhisperStop</h2>
          <p className="text-secondary">Help stop misinformation on WhatsApp.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <div>
            <label className="label">Display Name</label>
            <input 
              type="text" 
              className="input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aadish"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input 
              type="email" 
              className="input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          {error && <div className="text-danger text-sm font-medium">{error}</div>}
          
          <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
            {loading ? <LoadingSpinner size={20} /> : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center text-secondary body-small">
          Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
