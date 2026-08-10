'use client';

import React from 'react';
import { ShoppingBag, Truck, Percent, ShieldCheck, Zap, Star } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick?: () => void;
}

export default function HeroBanner({ onExploreClick }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white shadow-2xl mb-10 border border-blue-800/80">
      {/* Animated Decorative Ambient Glows */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-pink-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Hero Copy */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Top Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-600/30 text-pink-300 text-xs font-bold border border-pink-500/40 backdrop-blur-md shadow-sm">
            <Zap size={14} className="text-pink-400 fill-pink-400" />
            <span>SUPER SAVINGS • Moxfood Online Store</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-[1.15] font-heading">
            MOXFOOD <br />
            <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">
              Healthy Seeds & Grocery
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-xl font-medium">
            Order fresh <strong>Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds & daily home essentials</strong> at wholesale prices with fast express home delivery.
          </p>

          {/* Key Feature Chips */}
          <div className="pt-1 flex flex-wrap gap-3 text-xs font-semibold text-blue-100">
            <div className="flex items-center gap-2 bg-blue-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-700/60 shadow-sm">
              <Truck size={16} className="text-pink-400" />
              <span>Fast Express Home Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-700/60 shadow-sm">
              <Percent size={16} className="text-pink-400" />
              <span>10% to 25% Off MRP</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-700/60 shadow-sm">
              <ShieldCheck size={16} className="text-pink-400" />
              <span>100% Quality Guaranteed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-pink-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer font-heading"
            >
              <ShoppingBag size={20} />
              <span>Shop Healthy Seeds Now</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-900/50 border border-blue-700/40 text-xs font-bold text-pink-300 font-heading">
              <Star size={16} className="fill-pink-400 text-pink-400" />
              <span>4.9 / 5 Customer Rating</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Glassmorphic Combo Showcase */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="glass-card-dark p-6 rounded-3xl shadow-2xl relative border border-white/15 space-y-4 hover:border-pink-500/50 transition-all duration-300">
            <div className="absolute -top-3.5 -right-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-pink-400/40 font-heading">
              🔥 SPECIAL COMBO
            </div>

            <div className="flex items-center gap-2 text-pink-300 font-extrabold text-base font-heading">
              <span>🌾 Monthly Healthy Seeds Combo Pack</span>
            </div>

            <p className="text-xs text-blue-200 leading-relaxed font-medium">
              Pumpkin Seeds + Chia Seeds + Sunflower Seeds + Flax Seeds at exclusive combo discount!
            </p>

            <div className="space-y-2 text-xs border-t border-white/10 pt-3 font-semibold">
              <div className="flex justify-between text-blue-100">
                <span>• Raw Pumpkin Seeds (250g)</span>
                <span className="font-extrabold text-pink-400 font-heading">₹199</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>• Organic Chia Seeds (250g)</span>
                <span className="font-extrabold text-pink-400 font-heading">₹180</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>• Raw Sunflower Seeds (250g)</span>
                <span className="font-extrabold text-pink-400 font-heading">₹150</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <div>
                <span className="text-blue-300 font-medium">Total Savings: </span>
                <span className="text-pink-400 font-black text-sm font-heading">₹100+ OFF</span>
              </div>
              <span className="text-[11px] font-extrabold text-pink-300 bg-pink-500/20 px-3 py-1.5 rounded-xl border border-pink-400/30 font-heading">
                Moxfood Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
