'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';

interface AdminAuthModalProps {
  onSuccess: () => void;
}

export default function AdminAuthModal({ onSuccess }: AdminAuthModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password.trim() === '123') {
      onSuccess();
    } else {
      setErrorMsg('Invalid admin username or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 animate-zoom-in">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Moxfood Admin Login
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Enter authorized store management credentials to continue
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Username
            </label>
            <input
              type="text"
              required
              placeholder="Username (e.g. admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Password (e.g. 123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl pl-4 pr-10 py-3 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
              />
              <KeyRound size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black py-3.5 rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs"
          >
            <span>Access Admin Panel</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
