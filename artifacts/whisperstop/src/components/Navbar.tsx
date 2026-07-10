import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  if (user) {
    navLinks.splice(1, 0, { name: 'Verify', path: '/verify' });
    navLinks.splice(1, 0, { name: 'Submit', path: '/submit' });
    if (user.isAdmin) {
      navLinks.push({ name: 'Admin', path: '/admin' });
    }
  }

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-surface)',
          borderBottom: 'var(--header-border, 1px solid var(--color-border))',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
          transition: 'box-shadow var(--transition-fast), background-color var(--transition-base)',
        }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <ShieldAlert size={24} className="text-accent" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--color-text)' }}>
              WhisperStop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                style={{
                  fontWeight: 500,
                  color: location.pathname === link.path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                onMouseLeave={e => e.currentTarget.style.color = location.pathname === link.path ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="relative group">
                  <Link to="/profile" className="flex items-center justify-center" style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-accent)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </Link>
                </div>
                <button onClick={logout} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '14px' }}>Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            {user && <NotificationBell />}
            <button 
              className="btn-icon"
              onClick={() => setMobileMenuOpen(true)}
              style={{ color: 'var(--color-text)' }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-bg)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="flex justify-between items-center px-4 h-16 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px' }}>Menu</span>
            <button className="btn-icon" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className="p-3 rounded-md"
                style={{
                  backgroundColor: location.pathname === link.path ? 'var(--color-surface-hover)' : 'transparent',
                  color: location.pathname === link.path ? 'var(--color-accent)' : 'var(--color-text)',
                  fontWeight: 500,
                  fontSize: '18px'
                }}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between items-center mb-6 px-3">
                <span className="font-medium text-secondary">Theme</span>
                <ThemeToggle />
              </div>
              
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 p-3 mb-2 rounded-md bg-surface-hover" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-accent)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                    }}>
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="body-small text-muted">{user.email}</div>
                    </div>
                  </Link>
                  <button onClick={logout} className="btn btn-outline w-full justify-center">Logout</button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="btn btn-outline justify-center">Login</Link>
                  <Link to="/register" className="btn btn-primary justify-center">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
