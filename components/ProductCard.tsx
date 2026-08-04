'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    altNameGujarati?: string;
    category: string;
    price: number;
    mrp: number;
    stock: number;
    unit: string;
    images: string[];
    description?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.productId === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
      {/* Discount Tag */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
          <Tag size={10} />
          <span>{discountPercent}% OFF</span>
        </div>
      )}

      {/* Product Image Link */}
      <Link href={`/product/${product._id}`} className="block relative aspect-square bg-slate-50 overflow-hidden p-4 cursor-pointer">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unit Badge */}
          <div className="inline-block text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1.5 border border-blue-100">
            📦 {product.unit}
          </div>

          {/* Title */}
          <Link href={`/product/${product._id}`} className="cursor-pointer">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-pink-600 transition-colors mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          {/* Price View */}
          <div>
            <div className="text-base font-black text-slate-900 flex items-baseline gap-1.5">
              <span>₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Incl. all taxes</div>
          </div>

          {/* Add / Quantity Button */}
          {quantityInCart === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                product.stock > 0
                  ? 'bg-pink-600 hover:bg-pink-500 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag size={14} />
              <span>{product.stock > 0 ? 'Add' : 'Out of Stock'}</span>
            </button>
          ) : (
            <div className="flex items-center bg-blue-900 text-white rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => updateQuantity(product._id, quantityInCart - 1)}
                className="w-7 h-8 flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center text-xs font-bold bg-blue-950 py-1">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateQuantity(product._id, quantityInCart + 1)}
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
