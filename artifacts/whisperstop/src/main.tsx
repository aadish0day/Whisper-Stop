import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Synchronous theme initialization to prevent flash
(function() {
  try {
    const saved = localStorage.getItem('whisperstop-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  } catch (e) {}
})();

createRoot(document.getElementById('root')!).render(<App />);
