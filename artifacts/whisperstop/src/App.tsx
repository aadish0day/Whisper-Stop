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

// Small wrapper to scroll to top on route change
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
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claim/:claimId" element={<ClaimDetail />} />
          
          {/* Protected Routes */}
          <Route path="/submit" element={<ProtectedRoute><Submit /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><VerifyQueue /></ProtectedRoute>} />
          <Route path="/verify/:claimId" element={<ProtectedRoute><VerifyDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Simple Footer */}
      <footer className="py-8 text-center border-t mt-auto" style={{ borderColor: 'var(--color-border)' }}>
        <p className="body-small text-muted">
          © 2026 WhisperStop. Community-powered fact-checking.
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
