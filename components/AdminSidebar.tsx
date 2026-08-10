'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  LogOut,
  Store,
  ChevronRight,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: 'Dashboard Overview',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Manage Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Manage Categories',
      path: '/admin/categories',
      icon: Grid,
    },
    {
      name: 'Manage Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Manage Hero Banners',
      path: '/admin/banners',
      icon: ImageIcon,
    },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('moxfoodAdminAuth');
      router.push('/');
    }
  };

  return (
    <aside className="w-full md:w-64 bg-blue-950 text-slate-300 p-6 flex flex-col justify-between shrink-0 min-h-[calc(100vh-64px)] border-r border-blue-900 shadow-xl">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 pb-4 border-b border-blue-900">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
            <Store size={22} />
          </div>
          <div>
            <div className="font-black text-white text-lg leading-none font-heading">
              Admin Portal
            </div>
            <div className="text-[10px] text-pink-400 font-semibold">Moxfood</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                    : 'text-slate-300 hover:bg-blue-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-white" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="pt-6 border-t border-blue-900 space-y-4">
        <div className="bg-blue-900/40 p-3 rounded-xl border border-blue-800 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-white">System Status</div>
          <div>Moxfood Store Backend Connected</div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-600 text-red-300 hover:text-white px-4 py-3 rounded-2xl text-xs font-bold transition-all border border-red-800/40 cursor-pointer"
        >
          <LogOut size={16} />
          <span>Exit Admin Panel</span>
        </button>
      </div>
    </aside>
  );
}
