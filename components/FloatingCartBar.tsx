'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
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
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 z-50 pointer-events-auto sm:max-w-md animate-zoom-in">
      {/* Full-Width Wide Direct Checkout Pink Floating Cart Button */}
      <Link
        href="/checkout"
        className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:from-pink-500 hover:to-rose-500 text-white px-4 py-3.5 sm:px-6 sm:py-4 rounded-2xl shadow-2xl shadow-pink-600/50 transition-all flex items-center justify-between gap-3 active:scale-[0.99] cursor-pointer border border-pink-400/40"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Item Image Thumbnail Preview / Cart Badge Icon */}
          <div className="w-9 h-9 rounded-xl bg-white/20 p-1 shrink-0 overflow-hidden border border-white/30 flex items-center justify-center">
            {lastItemImage ? (
              <img src={lastItemImage} alt="Cart item" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <ShoppingBag size={18} className="text-white" />
            )}
          </div>

          <div className="text-left leading-tight min-w-0">
            <div className="font-black text-sm text-white font-heading truncate">
              {totalItemsCount} {language === 'gu' ? 'વસ્તુઓ કાર્ટમાં' : totalItemsCount === 1 ? 'Item in Cart' : 'Items in Cart'}
            </div>
            <div className="text-xs font-black text-pink-100">
              ₹{grandTotal} <span className="text-[10px] text-pink-200 font-normal">({language === 'gu' ? 'કુલ રકમ' : 'Grand Total'})</span>
            </div>
          </div>
        </div>

        <div className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl font-extrabold text-xs text-white flex items-center gap-1.5 shrink-0 shadow-inner font-heading">
          <span>{language === 'gu' ? 'ઓર્ડર કરો' : 'Checkout'}</span>
          <ArrowRight size={15} />
        </div>
      </Link>
    </div>
  );
}
