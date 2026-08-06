'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingCartBar() {
  const pathname = usePathname();
  const {
    items,
    totalItemsCount,
    grandTotal,
  } = useCart();
  const { language } = useLanguage();

  // Hide on Admin pages, Checkout page, or when cart is empty
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/checkout') || totalItemsCount === 0) {
    return null;
  }

  // Get last added item image for thumbnail preview
  const lastItem = items[items.length - 1];
  const lastItemImage = lastItem?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80';

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 z-50 pointer-events-auto animate-zoom-in">
      {/* Direct Checkout Floating Pink Cart Button */}
      <Link
        href="/checkout"
        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl shadow-pink-600/50 transition-all flex items-center gap-2.5 shrink-0 active:scale-95 cursor-pointer border border-pink-400/40"
      >
        {/* Item Image Thumbnail Preview */}
        <div className="w-8 h-8 rounded-lg bg-white/20 p-0.5 shrink-0 overflow-hidden border border-white/30 hidden sm:block">
          <img src={lastItemImage} alt="Cart item" className="w-full h-full object-contain rounded" />
        </div>

        <div className="text-left leading-tight">
          <div className="font-black text-xs sm:text-sm font-heading flex items-center gap-1">
            <span>{language === 'gu' ? 'કાર્ટ' : 'Cart'}</span>
            <ArrowRight size={14} className="text-pink-200" />
          </div>
          <div className="text-[11px] text-pink-100 font-extrabold">
            {totalItemsCount} {language === 'gu' ? 'વસ્તુઓ' : totalItemsCount === 1 ? 'item' : 'items'} • ₹{grandTotal}
          </div>
        </div>
      </Link>
    </div>
  );
}
