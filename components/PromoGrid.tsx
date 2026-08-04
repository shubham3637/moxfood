'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, Flame, ShieldAlert } from 'lucide-react';

export default function PromoGrid() {
  const promos = [
    {
      title: 'Atta & Pulses Monthly Ration',
      subtitle: 'Pure Aashirvaad Chakki Atta & Desi Toor Dal Pack',
      discount: 'SAVE UP TO ₹120',
      badge: 'FLAT OFF',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      link: '/?category=atta-rice',
      bgGradient: 'from-pink-600 to-rose-700',
    },
    {
      title: 'Cooking Oils & Pure Spices',
      subtitle: 'Fortune Sunflower Oil, Groundnut Oil & Everest Masalas',
      discount: 'WHOLESALE RATES',
      badge: 'SPECIAL',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      link: '/?category=oil-masala',
      bgGradient: 'from-blue-900 to-indigo-950',
    },
    {
      title: 'Tea, Coffee & Morning Snacks',
      subtitle: 'Wagh Bakri Tea, Maggi Noodles & Balaji Wafers',
      discount: 'BEST PRICE OFFER',
      badge: 'FRESH STOCK',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      link: '/?category=beverages',
      bgGradient: 'from-purple-900 to-blue-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
      {promos.map((promo, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${promo.bgGradient} text-white p-6 md:p-8 shadow-xl border border-white/10 group hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-64`}
        >
          {/* Background Image with Dark Gradient Layer */}
          <div className="absolute inset-0 z-0">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Card Header Tag */}
          <div className="relative z-10 flex justify-between items-start">
            <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {promo.badge}
            </span>
            <span className="bg-pink-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
              {promo.discount}
            </span>
          </div>

          {/* Card Content & Action */}
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-extrabold text-white leading-tight font-heading group-hover:text-pink-300 transition-colors">
              {promo.title}
            </h3>
            <p className="text-xs text-slate-200 line-clamp-2 font-medium">
              {promo.subtitle}
            </p>

            <div className="pt-2">
              <Link
                href={promo.link}
                className="inline-flex items-center gap-2 text-xs font-black text-pink-300 hover:text-white transition-colors cursor-pointer group/btn"
              >
                <span>Explore Deals</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
