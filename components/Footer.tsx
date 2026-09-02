'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Phone, MapPin, Clock, ShieldCheck, Truck, CreditCard, FileText } from 'lucide-react';

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
            Order raw & roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds, spices, and daily healthy grocery at best prices online in Surat.
          </p>
          <div className="flex items-center gap-2 text-xs text-pink-300 font-bold bg-blue-900/70 p-3 rounded-xl border border-blue-800">
            <ShieldCheck size={16} className="text-pink-400 shrink-0" /> 100% Quality & Purity Guaranteed
          </div>
        </div>

        {/* Company & Support Links */}
        <div>
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Company & Quick Links
          </h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-300">
            <li>
              <Link href="/track-order" className="text-pink-300 hover:text-pink-200 transition-colors font-extrabold flex items-center gap-1.5">
                <Truck size={14} className="text-pink-400" />
                <span>Track Your Order (ઓર્ડર ટ્રેક કરો)</span>
              </Link>
            </li>
            <li><Link href="/about" className="hover:text-pink-400 transition-colors cursor-pointer">About Us (અમારા વિશે)</Link></li>
            <li><Link href="/contact" className="hover:text-pink-400 transition-colors cursor-pointer">Contact Us & Support (સંપર્ક)</Link></li>
            <li><Link href="/products?category=seeds-superfoods" className="hover:text-pink-400 transition-colors cursor-pointer">Healthy Seeds & Superfoods</Link></li>
            <li><Link href="/products?category=dry-fruits" className="hover:text-pink-400 transition-colors cursor-pointer">Dry Fruits & Nuts</Link></li>
            <li><Link href="/products?category=atta-rice" className="hover:text-pink-400 transition-colors cursor-pointer">Atta, Rice & Grains</Link></li>
          </ul>
        </div>

        {/* Legal Policies */}
        <div>
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Store Policies & Legal
          </h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-300">
            <li><Link href="/privacy-policy" className="hover:text-pink-400 transition-colors cursor-pointer">Privacy Policy (પ્રાઈવસી પોલિસી)</Link></li>
            <li><Link href="/terms-conditions" className="hover:text-pink-400 transition-colors cursor-pointer">Terms & Conditions (નિયમો અને શરતો)</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-pink-400 transition-colors cursor-pointer">Shipping & Delivery Policy (ડિલિવરી નીતિ)</Link></li>
            <li><Link href="/refund-policy" className="hover:text-pink-400 transition-colors cursor-pointer">Cancellation & Refund Policy (રિફંડ નીતિ)</Link></li>
          </ul>
        </div>

        {/* Store Location & Hours */}
        <div className="space-y-3">
          <h3 className="text-white font-extrabold text-sm mb-3.5 border-b border-blue-900 pb-1.5 font-heading">
            Contact & Store Location
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-pink-400 shrink-0 mt-0.5" />
              <span>Gautam Trading, Surat, Gujarat</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-pink-400 shrink-0" />
              <a href="tel:+917096396856" className="hover:text-pink-400 transition-colors">
                +91 7096396856 (Call & WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <InstagramIcon size={16} className="text-pink-400 shrink-0" />
              <a
                href="https://www.instagram.com/gautamtrading_?igsi=MTN2YXV3cDB1bmgxaw=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors text-pink-300 font-extrabold"
              >
                @gautamtrading_ (Instagram)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={16} className="text-pink-400 shrink-0" />
              <span>Daily Express Delivery: 8 AM - 9 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Store Dispatch, Delivery & Return Policy Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-blue-900/60 border border-blue-800 rounded-2xl p-4 sm:p-5 text-xs text-slate-200 space-y-3 font-medium shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dispatch & Delivery */}
            <div className="flex items-start gap-3 bg-blue-950/80 p-3 rounded-xl border border-blue-800/80">
              <Truck size={20} className="text-pink-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-white text-xs font-heading">
                  Dispatch &amp; Delivery Timeline
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  <strong>Dispatch Time:</strong> 2-3 Days <br />
                  <strong>Delivery Within:</strong> 7-10 Days (ડિસ્પેચ: 2-3 દિવસ, ડિલિવરી: 7-10 દિવસ)
                </div>
              </div>
            </div>

            {/* No Return on Food Items */}
            <div className="flex items-start gap-3 bg-blue-950/80 p-3 rounded-xl border border-blue-800/80">
              <ShieldCheck size={20} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-white text-xs font-heading">
                  Return Policy (ફૂડ આઇટમ્સ નીતિ)
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  <strong>No Return on Food Items.</strong> (ફૂડ આઇટમ્સ માં કોઇ રિટર્ન નથી)
                </div>
              </div>
            </div>

            {/* Mandatory Unboxing Video Notice */}
            <div className="flex items-start gap-3 bg-blue-950/80 p-3 rounded-xl border border-blue-800/80">
              <FileText size={20} className="text-pink-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-white text-xs font-heading">
                  Damaged / Missing Item Claim
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  જો પાર્સલમાં વસ્તુ મિસિંગ કે ડેમેજ હોય તો પાર્સલ ખોલતા પહેલાં વીડિયો બનાવવો ફરજિયાત છે. (Record video BEFORE opening parcel)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-blue-900/80 pt-6 text-center text-xs text-slate-400 font-medium space-y-1">
        <div>© {new Date().getFullYear()} Moxfood Healthy Seeds &amp; Grocery Store. All Rights Reserved.</div>
        <div className="text-[11px] text-slate-500">Fast Doorstep Delivery • Dispatch 2-3 days • Delivery 7-10 days</div>
      </div>
    </footer>
  );
}
