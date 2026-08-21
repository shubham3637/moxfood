import React from 'react';
import Metadata from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  MapPin,
  ArrowRight,
  Leaf,
  Users,
} from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata = {
  title: 'About Us - Moxfood | Healthy Seeds & Superfood Store Surat',
  description:
    'Learn about Moxfood, Surat’s premier destination for 100% raw and roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds, and healthy daily grocery.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  openGraph: {
    title: 'About Us - Moxfood Store Surat',
    description:
      'Discover Moxfood’s story and commitment to delivering 100% pure, lab-tested healthy seeds and superfoods across Surat.',
    url: getCanonicalUrl('/about'),
    siteName: 'Moxfood',
    images: [{ url: getCanonicalUrl('/logo.png'), width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 md:px-10 lg:px-16 space-y-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-extrabold text-xs px-4 py-1.5 rounded-full border border-pink-200 font-heading">
          <Sparkles size={14} />
          <span>OUR STORY & MISSION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading leading-tight">
          Nourishing Families with 100% Pure Healthy Seeds & Grocery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Welcome to <strong className="text-pink-600 font-bold">Moxfood</strong>. We are dedicated to bringing raw and roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds, and essential healthy grocery straight from local stores to your doorstep in Surat.
        </p>
      </div>

      {/* Core Highlights Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Leaf size={24} />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-heading">100% Pure & Organic Seeds</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            We carefully source chemical-free, lab-tested raw and roasted superfood seeds rich in protein, fiber, Omega-3, and essential minerals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
            <Truck size={24} />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-heading">Fast Express Express Delivery</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Operating locally in Surat, we ensure direct express doorstep delivery within 15 to 30 minutes so your daily healthy essentials are always fresh.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award size={24} />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-heading">Wholesale Pricing for Everyone</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Get up to 25% discount off MRP on all seed packs, dry fruit combos, and daily ration packs without compromising on premium quality.
          </p>
        </div>
      </div>

      {/* Brand Values & Story */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Why Moxfood Healthy Seeds?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Healthy seeds are nature’s powerhouses. Incorporating raw & roasted Pumpkin Seeds, Chia Seeds, and Sunflower Seeds into daily diets promotes heart health, immunity, weight management, and vital energy.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Rich in Protein, Fiber, Magnesium & Antioxidants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Clean, hygienic, zero-preservative seed packaging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Trusted by thousands of local families across Surat</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Secure Online Prepaid Payments via Razorpay UPI & Cards</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-6 rounded-3xl text-white space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl">
                <img src="/logo.png" alt="Moxfood" className="h-10 w-auto object-contain rounded-lg" />
              </div>
              <div>
                <h4 className="font-extrabold text-base font-heading">Store Location</h4>
                <p className="text-xs text-pink-300 font-semibold">Surat, Gujarat, India</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300 font-medium border-t border-slate-800 pt-4">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-pink-400" /> Gautam Trading, Surat, Gujarat
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall size={14} className="text-pink-400" /> +91 7096396856 (WhatsApp & Call)
              </p>
              <p className="flex items-center gap-2">
                <Users size={14} className="text-pink-400" /> Direct Support 8:00 AM - 9:00 PM Daily
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-black px-5 py-3 rounded-2xl shadow-lg transition-all font-heading"
            >
              <span>Explore Seeds Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
