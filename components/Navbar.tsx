'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, MapPin, Store, Menu, X, PhoneCall, ShieldCheck, Zap, Grid } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItemsCount, toggleCartDrawer } = useCart();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide Navbar completely on all Admin routes (/admin/*)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-blue-950/95 backdrop-blur-md text-white shadow-xl border-b border-blue-800/80 transition-all overflow-x-hidden">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 md:px-10 font-bold flex justify-between items-center w-full shadow-inner">
        <div className="flex items-center gap-1.5 truncate">
          <Zap size={13} className="text-yellow-300 fill-yellow-300 animate-bounce shrink-0" />
          <span className="truncate">
            <strong>Gautam Trading</strong> • {t('topNotice')}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-xs font-semibold shrink-0">
          <span className="flex items-center gap-1.5"><PhoneCall size={13} /> +91 98765 43210</span>
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> {t('qualityBadge')}</span>
        </div>
      </div>

      {/* Main Responsive Header Bar */}
      <div className="w-full max-w-full px-2.5 sm:px-6 md:px-10 lg:px-12 py-2.5 sm:py-3.5 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer min-w-0">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center font-bold text-lg sm:text-2xl shadow-lg shadow-pink-600/40 group-hover:scale-105 transition-transform shrink-0">
            <Store size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-sm sm:text-2xl font-black tracking-tight leading-none text-white flex items-center gap-1 font-heading truncate">
              GAUTAM <span className="text-pink-400">TRADING</span>
            </div>
            <div className="text-[9px] sm:text-[11px] text-pink-200 font-bold tracking-wide mt-0.5 truncate">
              {t('storeSubtitle')}
            </div>
          </div>
        </Link>

        {/* Location Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs bg-blue-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-blue-700/60 shadow-inner">
          <MapPin size={16} className="text-pink-400 shrink-0 animate-pulse" />
          <div className="text-left">
            <div className="font-extrabold text-blue-100">{t('locationTitle')}</div>
            <div className="text-pink-300 text-[10px] font-semibold">{t('locationSub')}</div>
          </div>
        </div>

        {/* Expanded Full Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden sm:block">
          <div className="relative group">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-blue-900/70 text-white placeholder-blue-300/70 text-xs sm:text-sm rounded-full pl-5 pr-12 py-3 border border-blue-700/80 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-blue-900 transition-all shadow-inner font-medium"
            />
            <button
              type="submit"
              aria-label="Search items"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-md cursor-pointer"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Navigation & Cart Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language Switcher Pill */}
          <LanguageSwitcher />

          {/* Shop All Products Link (Desktop) */}
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1.5 text-xs font-extrabold px-4 py-2.5 rounded-full bg-blue-900/80 hover:bg-blue-800 text-white transition-all border border-blue-700/80 cursor-pointer shadow-sm hover:border-pink-500/50"
          >
            <Grid size={16} className="text-pink-400" />
            <span>{t('allProductsBtn')}</span>
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={toggleCartDrawer}
            className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-pink-600/30 active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{t('cartBtn')}</span>
            {totalItemsCount > 0 && (
              <span className="bg-blue-950 text-white text-[10px] sm:text-xs font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-pink-300 shadow-inner animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-1 text-blue-200 hover:text-white cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Menu Bar */}
      <div className="sm:hidden px-3 pb-2.5 pt-0.5 border-t border-blue-900">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-blue-900/90 text-white placeholder-blue-300/70 text-xs rounded-full pl-3.5 pr-9 py-2 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            aria-label="Search items mobile"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center cursor-pointer"
          >
            <Search size={13} />
          </button>
        </form>

        {isMobileMenuOpen && (
          <div className="mt-2.5 py-2 border-t border-blue-900 flex flex-col gap-1.5 text-xs font-semibold">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 px-3 rounded-xl hover:bg-blue-900 text-blue-100 cursor-pointer flex items-center gap-2"
            >
              🏠 Home Page
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 px-3 rounded-xl hover:bg-blue-900 text-pink-300 font-bold cursor-pointer flex items-center gap-2"
            >
              📦 {t('allProductsBtn')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
