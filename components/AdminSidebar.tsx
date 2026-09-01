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
  Tag,
  LogOut,
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
      name: 'Manage Coupons',
      path: '/admin/coupons',
      icon: Tag,
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
        {/* Brand Logo */}
        <div className="flex items-center gap-3 pb-4 border-b border-blue-900">
          <div className="bg-white p-1 rounded-2xl shadow border border-blue-800 shrink-0">
            <img
              src="/logo.png"
              alt="Moxfood Logo"
              className="h-9 w-auto object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="font-black text-white text-base leading-none font-heading">
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
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer font-heading ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                    : 'text-slate-300 hover:bg-blue-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="pt-6 border-t border-blue-900 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full bg-slate-900 hover:bg-red-600 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer font-heading"
        >
          <LogOut size={16} />
          <span>Logout Admin</span>
        </button>
        <div className="text-[10px] text-slate-500 text-center font-medium">
          Moxfood Super Store Admin v1.0
        </div>
      </div>
    </aside>
  );
}
