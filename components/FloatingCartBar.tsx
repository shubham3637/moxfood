'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingCartBar() {
  const pathname = usePathname();
  const {
    items,
    totalItemsCount,
    subtotal,
    grandTotal,
    freeDeliveryThreshold,
    toggleCartDrawer,
  } = useCart();
  const { language } = useLanguage();

  // Hide on Admin pages, Checkout page, or when cart is empty
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/checkout') || totalItemsCount === 0) {
    return null;
  }

  const amountLeftForFreeDelivery = freeDeliveryThreshold - subtotal;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;

  // Get last added item image for Zepto-style thumbnail preview
  const lastItem = items[items.length - 1];
  const lastItemImage = lastItem?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80';

  return (
    <div className="fixed bottom-4 left-3 right-3 z-50 flex items-center justify-between gap-2 max-w-lg mx-auto pointer-events-auto animate-zoom-in">
      {/* Left Card: Free Delivery Progress Status Bar */}
      <div
        onClick={toggleCartDrawer}
        className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl px-3.5 py-2.5 shadow-2xl border border-slate-800 flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-slate-850 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-pink-600/30 text-pink-400 border border-pink-500/40 flex items-center justify-center shrink-0">
          {isFreeDelivery ? (
            <Sparkles size={18} className="text-yellow-300 animate-pulse" />
          ) : (
            <Truck size={18} className="text-pink-400 animate-bounce" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {isFreeDelivery ? (
            <div>
              <div className="font-extrabold text-xs text-white flex items-center gap-1 truncate font-heading">
                <span>🎉 {language === 'gu' ? 'ફ્રી ડિલિવરી અનલોક થઈ ગઈ!' : 'FREE Delivery Unlocked!'}</span>
              </div>
              <div className="text-[10px] text-pink-300 font-semibold truncate">
                {language === 'gu' ? '₹0 ડિલિવરી ચાર્જ નો લાભ લો' : 'Enjoy ₹0 delivery fee on this order'}
              </div>
            </div>
          ) : (
            <div>
              <div className="font-extrabold text-xs text-white truncate font-heading">
                {language === 'gu' ? 'ફ્રી ડિલિવરી નો લાભ લો' : 'Unlock FREE Delivery'}
              </div>
              <div className="text-[10px] text-pink-300 font-semibold truncate">
                {language === 'gu'
                  ? `હજુ ₹${amountLeftForFreeDelivery} નો ઉમેરો કરો`
                  : `Add ₹${amountLeftForFreeDelivery} more to get FREE delivery`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Button: Zepto Style Floating Cart Button */}
      <button
        onClick={toggleCartDrawer}
        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-3.5 sm:px-4 py-2.5 rounded-2xl shadow-xl shadow-pink-600/40 transition-all flex items-center gap-2.5 shrink-0 active:scale-95 cursor-pointer border border-pink-400/40"
      >
        {/* Item Image Thumbnail Preview */}
        <div className="w-8 h-8 rounded-lg bg-white/20 p-0.5 shrink-0 overflow-hidden border border-white/30 hidden sm:block">
          <img src={lastItemImage} alt="Cart item" className="w-full h-full object-contain rounded" />
        </div>

        <div className="text-left leading-tight">
          <div className="font-black text-xs sm:text-sm font-heading flex items-center gap-1">
            <span>{language === 'gu' ? 'કાર્ટ' : 'Cart'}</span>
            <ArrowRight size={13} className="text-pink-200" />
          </div>
          <div className="text-[10px] text-pink-100 font-extrabold">
            {totalItemsCount} {language === 'gu' ? 'વસ્તુઓ' : totalItemsCount === 1 ? 'item' : 'items'} • ₹{grandTotal}
          </div>
        </div>
      </button>
    </div>
  );
}
