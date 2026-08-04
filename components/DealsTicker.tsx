'use client';

import React from 'react';
import { Flame, Sparkles, Truck, Tag, Percent } from 'lucide-react';

export default function DealsTicker() {
  const tickerItems = [
    { icon: <Flame size={14} className="text-pink-400" />, text: 'TODAY SUPER DEAL: Aashirvaad Chakki Atta 5kg at ₹365 (₹45 OFF MRP)' },
    { icon: <Tag size={14} className="text-pink-400" />, text: 'FLAT DISCOUNT: Fortune Sunflower Oil 1L at Wholesale ₹135' },
    { icon: <Truck size={14} className="text-pink-400" />, text: 'EXPRESS DELIVERY: Free Home Delivery on all orders above ₹499' },
    { icon: <Percent size={14} className="text-pink-400" />, text: 'COMBO SAVINGS: Up to 25% OFF on Monthly Grocery Ration Packs' },
    { icon: <Sparkles size={14} className="text-pink-400" />, text: 'QUALITY GUARANTEED: 100% Verified Branded & Fresh Grocery' },
  ];

  return (
    <div className="w-full bg-blue-950 text-white text-xs py-2.5 overflow-hidden border-b border-blue-800 shadow-md">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-extrabold text-blue-100">
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-blue-900/60 px-4 py-1 rounded-full border border-blue-800 shrink-0">
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
