'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Phone, MapPin, Clock, ShieldCheck, Truck, CreditCard } from 'lucide-react';

const InstagramIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

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
            <div className="bg-white p-1 rounded-2xl shadow border border-blue-800">
              <img
                src="/logo.png"
                alt="Moxfood Logo"
                className="h-10 w-auto object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg leading-none font-heading">
                Moxfood
              </div>
              <div className="text-xs text-pink-400 font-bold">Healthy Seeds & Superfood Store</div>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Order raw & roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds, spices, and daily healthy grocery at best prices online.
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
            <li><Link href="/products?category=seeds-superfoods" className="hover:text-pink-400 transition-colors cursor-pointer">Healthy Seeds & Superfoods</Link></li>
            <li><Link href="/products?category=dry-fruits" className="hover:text-pink-400 transition-colors cursor-pointer">Dry Fruits & Nuts</Link></li>
            <li><Link href="/products?category=atta-rice" className="hover:text-pink-400 transition-colors cursor-pointer">Atta, Rice & Grains</Link></li>
            <li><Link href="/products?category=oil-masala" className="hover:text-pink-400 transition-colors cursor-pointer">Edible Oil & Spices</Link></li>
            <li><Link href="/products?category=snacks" className="hover:text-pink-400 transition-colors cursor-pointer">Snacks & Namkeen</Link></li>
          </ul>
        </div>

        {/* Store Address & Contact */}
        <div>
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Contact & Store Location
          </h3>
          <ul className="space-y-3 text-xs text-slate-300 font-semibold">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-pink-400 shrink-0 mt-0.5" />
              <span>Surat, Gujarat, India</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-pink-400 shrink-0" />
              <a href="tel:+917096396856" className="hover:text-pink-400 transition-colors">
                +91 7096396856 / WhatsApp Support
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <InstagramIcon size={16} className="text-pink-400 shrink-0" />
              <a
                href="https://www.instagram.com/gautamoilandsugar?igsh=MTN2YXV3cDB1bmgxaw=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors text-pink-300 font-extrabold"
              >
                @gautamoilandsugar (Instagram)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={16} className="text-pink-400 shrink-0" />
              <span>Express Doorstep Delivery Daily</span>
            </li>
          </ul>
        </div>

        {/* Delivery & Payment Badges */}
        <div className="space-y-3">
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Payment & Trust
          </h3>
          <div className="bg-blue-900/40 p-4 rounded-2xl border border-blue-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CreditCard size={16} className="text-pink-400" />
              <span>Razorpay Online Payments</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Accepting UPI, GPay, PhonePe, Paytm, Credit/Debit Cards & Netbanking.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50">
            <Truck size={16} className="shrink-0" /> Fast Express Shipping in Surat & Across India
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-blue-900/80 pt-6 text-center text-xs text-slate-400 font-medium">
        © {new Date().getFullYear()} Moxfood Healthy Seeds & Grocery Super Store. All Rights Reserved.
      </div>
    </footer>
  );
}
