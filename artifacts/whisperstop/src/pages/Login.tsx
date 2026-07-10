import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedMock, setSelectedMock] = useState(mockUsers[0].uid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate network delay
    setTimeout(() => {
      login(selectedMock);
      navigate('/dashboard');
    }, 600);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      login(selectedMock);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-64px)]">
      <div className="card w-full" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-8">
          <h2 className="mb-2">Welcome Back</h2>
          <p className="text-secondary">Log in to verify claims and build reputation.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
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
            {loading ? <LoadingSpinner size={20} /> : 'Log In'}
          </button>
        </form>
        
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t" style={{ borderColor: 'var(--color-border)' }}></div>
          <span className="flex-shrink-0 mx-4 text-muted body-small">OR</span>
          <div className="flex-grow border-t" style={{ borderColor: 'var(--color-border)' }}></div>
        </div>
        
        <button 
          onClick={handleGoogle} 
          className="btn btn-outline w-full mb-6"
          disabled={loading}
        >
          Continue with Google
        </button>

        <div className="p-4 rounded-md mb-6" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
          <label className="label text-muted">Mock User Selection (For Preview)</label>
          <select 
            className="input" 
            value={selectedMock} 
            onChange={(e) => setSelectedMock(e.target.value)}
          >
            {mockUsers.map(u => (
              <option key={u.uid} value={u.uid}>{u.displayName} ({u.reputation} rep {u.isAdmin ? '- Admin' : ''})</option>
            ))}
          </select>
        </div>
        
        <p className="text-center text-secondary body-small">
          Don't have an account? <Link to="/register" className="text-accent font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
