'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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
  } = useCart();

  if (!isCartOpen) return null;

  const amountLeftForFreeDelivery = freeDeliveryThreshold - subtotal;
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

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
                <h2 className="font-extrabold text-base leading-none">Shopping Cart</h2>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  {items.reduce((acc, item) => acc + item.quantity, 0)} Items
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

          {/* Free Delivery Bar */}
          <div className="bg-pink-50 px-4 py-2.5 border-b border-pink-100">
            {subtotal >= freeDeliveryThreshold ? (
              <div className="flex items-center gap-2 text-xs font-bold text-pink-900">
                <Truck size={16} className="text-pink-600" />
                <span>🎉 Congratulations! You unlocked FREE Delivery!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs font-semibold text-blue-950 mb-1">
                  <span className="flex items-center gap-1">
                    <Truck size={14} className="text-pink-600" />
                    Save on FREE Delivery
                  </span>
                  <span className="text-pink-700 font-bold">Add ₹{amountLeftForFreeDelivery} more</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-600 transition-all duration-300 rounded-full"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-400">
                  <ShoppingBag size={32} />
                </div>
                <p className="font-bold text-slate-600 text-sm">Your Cart is Empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add items from the store catalog to place your order.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-white rounded-lg p-1 border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</h4>
                    {item.altNameGujarati && (
                      <p className="text-[11px] font-semibold text-pink-600 line-clamp-1">
                        {item.altNameGujarati}
                      </p>
                    )}
                    <div className="text-[11px] text-slate-500 mt-0.5">Unit: {item.unit}</div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm font-black text-slate-900">
                        ₹{item.price * item.quantity}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          (₹{item.price}/unit)
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-white rounded-lg border border-slate-300">
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

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-bold text-pink-600">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Grand Total:</span>
                  <span className="text-blue-900">₹{grandTotal}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
