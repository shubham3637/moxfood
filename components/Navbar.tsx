'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import CartDrawer from './CartDrawer';

const InstagramIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-xl">
        {/* Top Notification Announcement Bar */}
        <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 text-white px-4 py-1.5 text-[11px] sm:text-xs font-bold flex items-center justify-between font-heading shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Sparkles size={14} className="animate-spin text-pink-200 shrink-0" />
            <span className="truncate">
              <strong>Moxfood</strong> • {t('topNotice')}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold shrink-0">
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 hover:text-pink-200 transition-colors bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20"
            >
              <Truck size={13} className="text-pink-300" />
              <span>{language === 'gu' ? 'ઓર્ડર ટ્રેક કરો' : 'Track Order'}</span>
            </Link>
            <a
              href="tel:+917096396856"
              className="flex items-center gap-1.5 hover:text-pink-200 transition-colors"
            >
              <PhoneCall size={13} /> +91 7096396856
            </a>
            <a
              href="https://www.instagram.com/gautamtrading_?igsi=MTN2YXV3cDB1bmgxaw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-pink-200 transition-colors bg-black/20 px-2.5 py-0.5 rounded-full border border-white/20 font-heading"
            >
              <InstagramIcon size={13} className="text-pink-300" /> @gautamtrading_
            </a>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> {t('qualityBadge')}</span>
          </div>
        </div>

        {/* Main Responsive Header Bar */}
        <div className="w-full max-w-full px-3 sm:px-6 md:px-10 lg:px-12 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
          {/* Brand Logo from public/logo.png */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer">
            <div className="bg-white/95 p-1 rounded-2xl shadow-lg border border-pink-500/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Moxfood Logo"
                className="h-10 sm:h-12 w-auto max-w-[140px] sm:max-w-[170px] object-contain rounded-xl"
              />
            </div>
          </Link>

          {/* Expanded Full Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden sm:block">
            <div className="relative group">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs font-semibold rounded-full pl-4 pr-11 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-slate-800 shadow-inner transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-pink-600 hover:bg-pink-500 text-white p-1.5 rounded-full transition-colors cursor-pointer"
                aria-label="Search button"
              >
                <Search size={15} />
              </button>
            </div>
          </form>

          {/* Actions & Cart Control */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Track Order Direct Link Button */}
            <Link
              href="/track-order"
              className="bg-slate-800 hover:bg-slate-700 text-pink-300 border border-slate-700 text-[11px] sm:text-xs font-extrabold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer font-heading shrink-0"
              title="Track Order Status"
            >
              <Truck size={16} className="text-pink-400" />
              <span className="hidden md:inline">{language === 'gu' ? 'ઓર્ડર ટ્રેક કરો' : 'Track Order'}</span>
            </Link>

            {/* Instagram Quick Link Button (Mobile/Desktop) */}
            <a
              href="https://www.instagram.com/gautamoilandsugar?igsh=MTN2YXV3cDB1bmgxaw=="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-[11px] sm:text-xs font-extrabold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer font-heading shrink-0"
              title="Follow us on Instagram @gautamoilandsugar"
            >
              <InstagramIcon size={15} />
              <span className="hidden sm:inline">@gautamoilandsugar</span>
            </a>

            {/* Interactive Cart Button Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg shadow-pink-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer font-heading shrink-0"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-white text-pink-600 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-pink-600 shadow">
                    {totalItemsCount}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] opacity-80 uppercase tracking-wider">{t('cartTitle')}</span>
                <span className="text-xs font-black">₹{subtotal}</span>
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="px-3 pb-3 sm:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl pl-3.5 pr-10 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-pink-600 text-white p-1 rounded-lg"
              aria-label="Mobile Search"
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3 animate-fade-in text-xs font-semibold">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-200"
            >
              <span>{t('navHome')}</span>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>

            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-pink-400 font-bold"
            >
              <span className="flex items-center gap-2">
                <Truck size={16} />
                {language === 'gu' ? 'ઓર્ડર ટ્રેક કરો (Track Order)' : 'Track Order Status'}
              </span>
              <ChevronRight size={16} />
            </Link>

            <a
              href="https://www.instagram.com/gautamoilandsugar?igsh=MTN2YXV3cDB1bmgxaw=="
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-purple-400 font-bold"
            >
              <span className="flex items-center gap-2">
                <InstagramIcon size={16} />
                Instagram (@gautamoilandsugar)
              </span>
              <ChevronRight size={16} />
            </a>

            <a
              href="tel:+917096396856"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-emerald-400 font-bold"
            >
              <span className="flex items-center gap-2">
                <PhoneCall size={16} />
                Call +91 7096396856
              </span>
              <ChevronRight size={16} />
            </a>
          </div>
        )}
      </header>

      {/* Cart Side Drawer Modal */}
      <CartDrawer />
    </>
  );
}
