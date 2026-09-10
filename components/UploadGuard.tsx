'use client';

import { useState, useEffect } from 'react';

export default function UploadGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <form 
        onSubmit={(e) => { 
          e.preventDefault(); 
          if (password === 'admin' || password === 'varun2026') { 
            setIsAuthenticated(true); 
            localStorage.setItem('admin_auth', 'true');
          } else {
            alert('Incorrect password');
          }
        }} 
        className="glass-card p-8 space-y-6 w-full max-w-sm animate-slide-up"
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Admin Access</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Enter password to upload wallpapers.</p>
        </div>
        
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-field w-full"
            autoFocus
          />
        </div>
        <button type="submit" className="btn-primary w-full justify-center">
          Login
        </button>
      </form>
    </div>
  );
}
