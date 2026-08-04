'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Tag,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const { items, addToCart, updateQuantity, toggleCartDrawer } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      }
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw size={32} className="animate-spin text-pink-600" />
        <p className="text-sm font-bold text-slate-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl text-center border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">This product may have been removed.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </Link>
      </div>
    );
  }

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
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-pink-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Store</span>
      </Link>

      {/* Main Details Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
        {/* Left: Image Container */}
        <div className="md:col-span-6 flex flex-col items-center justify-center bg-blue-50/50 rounded-2xl p-6 relative border border-blue-100">
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 shadow">
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {product.category}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  product.stock > 0
                    ? 'bg-pink-100 text-pink-900'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Unit */}
            <div className="text-xs font-bold text-slate-600">
              Unit Pack Size: <span className="text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded font-mono border border-blue-100">{product.unit}</span>
            </div>

            {/* Pricing Card */}
            <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-pink-900 font-semibold mb-0.5">Special Price:</div>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
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
                  Your Total Savings: <br />
                  <span className="text-base text-pink-600">₹{product.mrp - product.price}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase text-slate-400">Description:</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
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
                  <span className="w-12 text-center font-extrabold text-sm text-slate-900">
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
                  className="w-full sm:flex-1 bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag size={20} />
                  <span>Add {quantity} to Cart</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold text-center border border-red-200">
                Sorry, this item is currently out of stock.
              </div>
            )}

            {/* Added Alert Banner */}
            {addedMessage && (
              <div className="p-3 bg-blue-900 text-white rounded-xl text-xs font-extrabold flex items-center justify-between animate-fade-in shadow-md">
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-pink-400" />
                  Item added to cart successfully!
                </span>
                <button onClick={toggleCartDrawer} className="underline text-pink-300 hover:text-white cursor-pointer">
                  View Cart
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                <ShieldCheck size={18} className="text-blue-900 shrink-0" />
                <span>100% Quality & Freshness</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                <Truck size={18} className="text-pink-600 shrink-0" />
                <span>Fast Express Home Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
