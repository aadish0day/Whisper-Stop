import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      <div className="text-6xl font-display font-bold text-accent mb-4">404</div>
      <h1 className="mb-4">Page not found</h1>
      <p className="text-secondary mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}
