'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Lock, Store, KeyRound, LogIn, ShieldAlert } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check session storage for existing login
    const authStatus = sessionStorage.getItem('gautamAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password.trim() === '123') {
      sessionStorage.setItem('gautamAdminAuth', 'true');
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Username or Password! (Default: admin / 123)');
    }
  };

  // Loading check
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs font-bold">Checking credentials...</div>;
  }

  // Render Protected Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 text-slate-900 relative">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-pink-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-600/30">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900">Admin Portal Login</h2>
            <p className="text-xs text-slate-500 font-medium">
              Gautam Trading Store Management • Authorized Personnel Only
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
            >
              <LogIn size={18} />
              <span>Login to Admin Panel</span>
            </button>
          </form>

          <div className="text-center pt-2 text-[11px] text-slate-400 border-t border-slate-100">
            Protected Admin Route • Username: <strong className="text-slate-700">admin</strong> | Password: <strong className="text-slate-700">123</strong>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Layout when authenticated
  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 antialiased">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
