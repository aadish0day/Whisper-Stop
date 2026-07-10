import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';

import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Submit from './pages/Submit';
import ClaimDetail from './pages/ClaimDetail';
import VerifyQueue from './pages/VerifyQueue';
import VerifyDetail from './pages/VerifyDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/not-found';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="bg-noise" />
      <div className="scanlines" />
      <div 
        className="fixed z-[100] pointer-events-none font-mono text-accent opacity-30 hidden md:block"
        style={{ top: '50%', left: '-200px', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '12px', letterSpacing: '0.4em', fontWeight: 800 }}
      >
        WHISPERSTOP // SYS.VER: 9.2.1 // TRK_MODE: ACTIVE // COORD: 43.2N, 12.1W // SEC: LEVEL_4
      </div>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claim/:claimId" element={<ClaimDetail />} />
          
          <Route path="/submit" element={<ProtectedRoute><Submit /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><VerifyQueue /></ProtectedRoute>} />
          <Route path="/verify/:claimId" element={<ProtectedRoute><VerifyDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="py-8 text-center border-t mt-auto relative z-10 bg-surface" style={{ borderColor: 'var(--color-border)' }}>
        <p className="data-text text-muted">
          © 2026 WhisperStop. // SECURE TRANSMISSION // END OF FILE.
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <AppContent />
            </BrowserRouter>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
