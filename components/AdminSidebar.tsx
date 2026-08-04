'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Store,
  Database,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSeedDatabase = async () => {
    if (confirm('Are you sure you want to reset & seed initial grocery store data?')) {
      setIsSeeding(true);
      setSeedMessage('');
      try {
        const res = await fetch('/api/seed?force=true', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setSeedMessage('Data seeded successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setSeedMessage('Error: ' + data.error);
        }
      } catch (err: any) {
        setSeedMessage('Failed: ' + err.message);
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gautamAdminAuth');
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Hero Banners', href: '/admin/banners', icon: <ImageIcon size={18} /> },
    { label: 'Products', href: '/admin/products', icon: <Package size={18} /> },
    { label: 'Categories', href: '/admin/categories', icon: <FolderTree size={18} /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={18} /> },
  ];

  return (
    <>
      {/* Mobile Sticky Admin Header Bar */}
      <div className="md:hidden sticky top-0 z-50 w-full bg-blue-950 text-white p-3.5 flex items-center justify-between border-b border-blue-900 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center font-bold text-base">
            <Store size={18} />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm font-heading leading-tight">Admin Portal</div>
            <div className="text-[10px] text-pink-400 font-semibold">Gautam Trading</div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 text-blue-200 hover:text-white rounded-lg bg-blue-900 border border-blue-800 cursor-pointer"
          aria-label="Toggle admin menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Admin Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-blue-950 text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-blue-900 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Brand Header (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5 pb-4 border-b border-blue-900">
            <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              <Store size={20} />
            </div>
            <div>
              <div className="font-extrabold text-white text-base leading-tight font-heading">Admin Panel</div>
              <div className="text-xs text-pink-400 font-bold">Gautam Trading Store</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-blue-200 hover:text-white hover:bg-blue-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-blue-900 space-y-3">
          {/* Seed Database Button */}
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="w-full bg-blue-900 hover:bg-blue-850 text-pink-300 border border-blue-800 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Database size={16} />
            <span>{isSeeding ? 'Seeding DB...' : 'Reset & Seed Grocery Data'}</span>
          </button>

          {seedMessage && (
            <div className="text-[11px] text-pink-400 font-semibold text-center flex items-center justify-center gap-1">
              <CheckCircle2 size={12} /> {seedMessage}
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/80 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout Admin</span>
          </button>

          {/* Return to Storefront */}
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
