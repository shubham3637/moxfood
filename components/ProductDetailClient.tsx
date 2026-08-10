'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductDetailClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-pink-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer font-heading"
      >
        <ArrowLeft size={16} />
        <span>{t('backToStore')}</span>
      </Link>

      {/* Main Details Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
        {/* Left: Image Container */}
        <div className="md:col-span-6 flex flex-col items-center justify-center bg-blue-50/50 rounded-2xl p-6 relative border border-blue-100">
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 shadow font-heading">
              <Tag size={12} />
              <span>{discountPercent}% DISCOUNT</span>
            </div>
          )}

          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-96 w-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Info & Actions */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Stock Badges */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-heading">
                {product.category}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full font-heading ${
                  product.stock > 0
                    ? 'bg-pink-100 text-pink-900'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {product.stock > 0 ? t('inStock') : t('outOfStock')}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight font-heading">
                {language === 'gu' && product.altNameGujarati ? product.altNameGujarati : product.name}
              </h1>
              {language === 'gu' && product.name && (
                <div className="text-xs font-semibold text-slate-400 mt-1">({product.name})</div>
              )}
            </div>

            {/* Unit */}
            <div className="text-xs font-bold text-slate-600">
              {t('unitPackSize')}{' '}
              <span className="text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded font-mono border border-blue-100">
                {product.unit}
              </span>
            </div>

            {/* Pricing Card */}
            <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-pink-900 font-semibold mb-0.5">{t('specialPrice')}</div>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2 font-heading">
                  <span>₹{product.price}</span>
                  {product.mrp > product.price && (
                    <span className="text-sm font-normal text-slate-400 line-through">
                      ₹{product.mrp}
                    </span>
                  )}
                </div>
              </div>
              {product.mrp > product.price && (
                <div className="text-right text-xs text-pink-900 font-extrabold">
                  {t('yourSavings')} <br />
                  <span className="text-base text-pink-600 font-heading">₹{product.mrp - product.price}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase text-slate-400 font-heading">{t('description')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Quantity Controls */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-300 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-bold cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-extrabold text-sm text-slate-900 font-heading">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-bold cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-heading"
                >
                  <ShoppingBag size={20} />
                  <span>
                    {t('addToCart')} ({quantity})
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold text-center border border-red-200 font-heading">
                {t('outOfStock')}
              </div>
            )}

            {/* Added Alert Banner */}
            {addedMessage && (
              <div className="p-3 bg-blue-900 text-white rounded-xl text-xs font-extrabold flex items-center justify-between animate-fade-in shadow-md font-heading">
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-pink-400" />
                  {t('addedSuccess')}
                </span>
                <Link href="/checkout" className="underline text-pink-300 hover:text-white cursor-pointer font-heading">
                  {t('viewCart')}
                </Link>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 font-bold">
              <div className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                <ShieldCheck size={18} className="text-blue-900 shrink-0" />
                <span>{t('qualityFreshness')}</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                <Truck size={18} className="text-pink-600 shrink-0" />
                <span>{t('fastDelivery')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
