'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Phone, MapPin, Clock, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer completely on all Admin routes (/admin/*)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-blue-950 text-slate-300 pt-12 pb-8 border-t border-blue-900">
      <div className="w-full px-4 md:px-10 lg:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Brand & Store Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              <Store size={22} />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg leading-none font-heading">
                Gautam Trading
              </div>
              <div className="text-xs text-pink-400 font-bold">General Grocery Super Store</div>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Order fresh whole wheat flour, sunflower oil, desi pulses, spices, and household essentials at best prices online.
          </p>
          <div className="flex items-center gap-2 text-xs text-pink-300 font-bold bg-blue-900/70 p-3 rounded-xl border border-blue-800">
            <ShieldCheck size={16} className="text-pink-400 shrink-0" /> 100% Quality & Purity Guaranteed
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Quick Categories
          </h3>
          <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
            <li><Link href="/products?category=atta-rice" className="hover:text-pink-400 transition-colors cursor-pointer">Atta, Rice & Grains</Link></li>
            <li><Link href="/products?category=oil-masala" className="hover:text-pink-400 transition-colors cursor-pointer">Edible Oil & Spices</Link></li>
            <li><Link href="/products?category=dairy-bakery" className="hover:text-pink-400 transition-colors cursor-pointer">Dairy & Breakfast</Link></li>
            <li><Link href="/products?category=snacks" className="hover:text-pink-400 transition-colors cursor-pointer">Snacks & Namkeen</Link></li>
            <li><Link href="/products?category=beverages" className="hover:text-pink-400 transition-colors cursor-pointer">Tea, Coffee & Drinks</Link></li>
          </ul>
        </div>

        {/* Store Address & Contact */}
        <div>
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Contact & Store Location
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-pink-400 shrink-0 mt-0.5" />
              <span>Main Market, Gautam Trading Shop No. 12, Station Road, Gujarat</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-pink-400 shrink-0" />
              <a href="tel:+919876543210" className="hover:text-white font-bold cursor-pointer">+91 98765 43210 / WhatsApp</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={16} className="text-pink-400 shrink-0" />
              <span>8:00 AM - 9:00 PM (Mon - Sun)</span>
            </li>
          </ul>
        </div>

        {/* Delivery Badges */}
        <div>
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Store Services
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-blue-900/60 rounded-2xl border border-blue-800 flex items-center gap-3">
              <Truck size={20} className="text-pink-400 shrink-0" />
              <div>
                <div className="font-extrabold text-white">Fast Express Delivery</div>
                <div className="text-[11px] text-blue-200">Direct store doorstep delivery</div>
              </div>
            </div>
            <div className="p-3 bg-blue-900/60 rounded-2xl border border-blue-800 flex items-center gap-3">
              <CreditCard size={20} className="text-pink-400 shrink-0" />
              <div>
                <div className="font-extrabold text-white">Instant UPI Pay</div>
                <div className="text-[11px] text-blue-200">Prepaid Online UPI (GPay/PhonePe/Paytm)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-10 lg:px-16 pt-5 border-t border-blue-900 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/80 gap-3">
        <div>© 2026 Gautam Trading. All Rights Reserved.</div>
        <div className="flex gap-4">
          <Link href="/products" className="text-pink-400 hover:text-pink-300 font-bold cursor-pointer">
            Browse All Products
          </Link>
        </div>
      </div>
    </footer>
  );
}
