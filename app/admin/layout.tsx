'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminAuthModal from '@/components/AdminAuthModal';
import { Lock } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = sessionStorage.getItem('moxfoodAdminAuth');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('moxfoodAdminAuth', 'true');
      setIsAuthenticated(true);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
        Authenticating Moxfood Admin Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuthModal onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white px-6 py-4 border-b border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-pink-600" />
            <span className="font-extrabold text-xs text-slate-800 font-heading">
              Moxfood Store Management • Authorized Personnel Only
            </span>
          </div>
          <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            Admin Session Active
          </span>
        </header>

        <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
