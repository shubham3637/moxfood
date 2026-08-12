'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';

interface ProductVariant {
  unit: string;
  price: number;
  mrp: number;
  stock: number;
}

interface ProductCardProps {
  product: {
    _id: string;
    slug?: string;
    name: string;
    altNameGujarati?: string;
    category: string;
    price: number;
    mrp: number;
    stock: number;
    unit: string;
    variants?: ProductVariant[];
    images: string[];
    description?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const { language, t } = useLanguage();
  const { showSuccess } = useToast();

  const productUrl = `/product/${product.slug || product._id}`;

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const initialVariant = hasVariants ? product.variants![0] : null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initialVariant);

  const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const cartId = product._id ? `${product._id}_${currentUnit}` : product._id;
  const cartItem = items.find((item) => item.productId === cartId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const discountPercent =
    currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : 0;

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

  const displayTitle = language === 'gu' && product.altNameGujarati ? product.altNameGujarati : product.name;

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      cartId,
      unit: currentUnit,
      price: currentPrice,
      mrp: currentMrp,
      stock: currentStock,
    };
    addToCart(itemToAdd, 1);
    showSuccess(`${product.name} (${currentUnit}) added to cart!`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
      {/* Discount Tag */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm font-heading">
          <Tag size={10} />
          <span>{discountPercent}% {t('off')}</span>
        </div>
      )}

      {/* Product Image Link with SEO slug */}
      <Link href={productUrl} className="block relative aspect-square bg-slate-50 overflow-hidden p-4 cursor-pointer">
        <img
          src={imageUrl}
          alt={displayTitle}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Weight Variants Switcher Bar */}
          {hasVariants ? (
            <div className="flex flex-wrap items-center gap-1 mb-2">
              {product.variants!.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer font-mono ${
                    currentUnit === v.unit
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {v.unit}
                </button>
              ))}
            </div>
          ) : (
            <div className="inline-block text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1.5 border border-blue-100 font-mono">
              📦 {currentUnit}
            </div>
          )}

          {/* Title with SEO slug */}
          <Link href={productUrl} className="cursor-pointer">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-pink-600 transition-colors mb-1 font-heading">
              {displayTitle}
            </h3>
          </Link>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          {/* Price View */}
          <div>
            <div className="text-base font-black text-slate-900 flex items-baseline gap-1.5 font-heading">
              <span>₹{currentPrice}</span>
              {currentMrp > currentPrice && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  ₹{currentMrp}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">{t('inclTaxes')}</div>
          </div>

          {/* Add / Quantity Button */}
          {quantityInCart === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={currentStock <= 0}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
                currentStock > 0
                  ? 'bg-pink-600 hover:bg-pink-500 text-white font-heading'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag size={14} />
              <span>{currentStock > 0 ? t('addToCart') : t('outOfStock')}</span>
            </button>
          ) : (
            <div className="flex items-center bg-blue-900 text-white rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => updateQuantity(cartId, quantityInCart - 1)}
                className="w-7 h-8 flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center text-xs font-bold bg-blue-950 py-1 font-heading font-mono">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateQuantity(cartId, quantityInCart + 1)}
                className="w-7 h-8 flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
