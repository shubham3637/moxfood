'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ChevronDown,
  ChevronUp,
  CreditCard,
  AlertCircle,
  Scale,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import BulkOrderWhatsAppModal from '@/components/BulkOrderWhatsAppModal';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    grandTotal,
    freeDeliveryThreshold,
    totalWeightGrams,
  } = useCart();

  const { t, language } = useLanguage();
  const [isBillDetailOpen, setIsBillDetailOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const isMinWeightSatisfied = totalWeightGrams >= 1000;
  const isMaxWeightExceeded = totalWeightGrams > 5000;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 bg-blue-900 text-white flex items-center justify-between border-b border-blue-800">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-pink-400" />
              <div>
                <h2 className="font-extrabold text-base leading-none font-heading">{t('shoppingCart')}</h2>
                <p className="text-[11px] text-blue-200 mt-0.5 font-semibold">
                  {items.reduce((acc, item) => acc + item.quantity, 0)} {t('items')} • Weight:{' '}
                  {totalWeightGrams < 1000 ? `${totalWeightGrams}g` : `${(totalWeightGrams / 1000).toFixed(1)}kg`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Weight Requirement Notice (< 1 kg) */}
          {items.length > 0 && !isMinWeightSatisfied && (
            <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200 flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <div>
                <div>
                  {language === 'gu'
                    ? 'ઓછામાં ઓછું ૧ કિલો (1000g) વજન હોવું ફરજિયાત છે.'
                    : 'Minimum 1 kg (1000g) order weight required.'}
                </div>
                <div className="text-[11px] font-semibold text-amber-700">
                  {language === 'gu'
                    ? `હાલનું વજન: ${totalWeightGrams}g (ઘટે છે: ${1000 - totalWeightGrams}g)`
                    : `Current weight: ${totalWeightGrams}g (Short: ${1000 - totalWeightGrams}g)`}
                </div>
              </div>
            </div>
          )}

          {/* Weight Requirement Notice (> 5 kg) */}
          {items.length > 0 && isMaxWeightExceeded && (
            <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-900">
              <AlertCircle size={18} className="text-emerald-600 shrink-0" />
              <div>
                <div>
                  {language === 'gu'
                    ? '૫ કિલોથી વધુ વજનના ઓર્ડર માટે વોટ્સએપ પર સંપર્ક કરો.'
                    : 'For orders above 5 kg, please place order on WhatsApp.'}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700">
                  {language === 'gu'
                    ? `હાલનું વજન: ${(totalWeightGrams / 1000).toFixed(1)} kg (> 5 kg)`
                    : `Current weight: ${(totalWeightGrams / 1000).toFixed(1)} kg (> 5 kg)`}
                </div>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-400">
                  <ShoppingBag size={32} />
                </div>
                <p className="font-extrabold text-slate-700 text-sm font-heading">{t('cartEmpty')}</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">
                  {t('cartEmptySub')}
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors font-medium"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1 font-heading">
                      {language === 'gu' && item.altNameGujarati ? item.altNameGujarati : item.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Unit: {item.unit}</div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm font-black text-slate-900 font-heading">
                        ₹{item.price * item.quantity}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          (₹{item.price}/unit)
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-white rounded-xl border border-slate-300">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-400 hover:text-red-600 p-1 self-start transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bottom Footer & Sticky Instant "Pay Now" Action Bar */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-white space-y-3 shadow-2xl">
              {/* Collapsible Bill Toggle Disclosure */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsBillDetailOpen(!isBillDetailOpen)}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors font-heading cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{language === 'gu' ? 'કુલ બિલ (Total Bill)' : 'Total Bill'}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      (Incl. taxes &amp; charges)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-pink-600">
                    <span className="font-extrabold text-sm">₹{grandTotal}</span>
                    {isBillDetailOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isBillDetailOpen && (
                  <div className="p-3 border-t border-slate-200 bg-white space-y-1.5 text-xs font-semibold text-slate-600 animate-fade-in">
                    <div className="flex justify-between">
                      <span>{t('subtotal')}</span>
                      <span className="font-bold text-slate-800">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('deliveryCharge')}</span>
                      <span className="font-bold text-pink-600">
                        {deliveryCharge === 0 ? t('free') : `₹${deliveryCharge}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dispatch & Return Policy Info Notice Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700 space-y-1 font-medium">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>🚚 Dispatch: 2-3 Days • Delivery: 7-10 Days</span>
                  <span className="text-pink-600 font-extrabold">No Return</span>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold leading-tight">
                  📹 પાર્સલમાં વસ્તુ મિસિંગ કે ડેમેજ હોય તો પાર્સલ ખોલતા પહેલાં વીડિયો બનાવવો ફરજિયાત છે.
                </div>
              </div>

              {/* Direct Instant "Pay Now" Sticky Footer Bar */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col text-left font-heading">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                    {language === 'gu' ? 'ચૂકવવાની રકમ' : 'To Pay'}
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{grandTotal}
                  </span>
                </div>

                {isMaxWeightExceeded ? (
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(true)}
                    className="flex-1 max-w-[210px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm font-heading"
                  >
                    <span>{language === 'gu' ? 'WhatsApp Order (>5kg)' : 'Order on WhatsApp'}</span>
                  </button>
                ) : isMinWeightSatisfied ? (
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 max-w-[200px] bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-3 px-5 rounded-2xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm font-heading"
                  >
                    <CreditCard size={18} />
                    <span>{language === 'gu' ? 'પેમેન્ટ કરો' : 'Pay Now'}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        language === 'gu'
                          ? 'ઓછામાં ઓછું ૧ કિલો (1000g) ઓર્ડર વજન હોવું ફરજિયાત છે. કૃપા કરીને કાર્ટમાં વધુ વસ્તુઓ ઉમેરો.'
                          : 'Minimum order weight must be 1 kg (1000g) to place an order. Please add more items.'
                      )
                    }
                    className="flex-1 max-w-[200px] bg-slate-300 text-slate-500 font-extrabold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed text-xs sm:text-sm font-heading"
                  >
                    <span>{language === 'gu' ? 'Min 1 kg Add Karo' : 'Add Min 1 kg'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Order WhatsApp Modal (> 5 kg) */}
      <BulkOrderWhatsAppModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        totalWeightGrams={totalWeightGrams}
        items={items}
      />
    </div>
  );
}
