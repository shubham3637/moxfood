import React from 'react';
import { Truck, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata = {
  title: 'Shipping & Delivery Policy - Moxfood Surat',
  description: 'Details regarding Moxfood fast doorstep delivery, local shipping timelines in Surat, delivery charges, and tracking orders.',
  alternates: {
    canonical: getCanonicalUrl('/shipping-policy'),
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
        <div className="border-b border-slate-100 pb-4 space-y-2">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-extrabold text-xs px-3.5 py-1 rounded-full border border-pink-200 font-heading">
            <Truck size={14} />
            <span>EXPRESS DELIVERY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">Shipping & Delivery Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 21, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">1. Delivery Coverage Area</h2>
          <p>
            <strong className="text-slate-900 font-bold">Moxfood</strong> provides fast express doorstep delivery across <strong className="text-pink-600 font-bold">Surat, Gujarat</strong> and surrounding local regions. We also dispatch healthy seed packages nationwide across India via reputed courier partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">2. Dispatch &amp; Delivery Timelines (ડિસ્પેચ અને ડિલિવરી સમય)</h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-2 text-slate-800 text-xs sm:text-sm font-semibold">
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                <span><strong className="text-slate-900 font-bold">Dispatch Time (ડિસ્પેચ સમય):</strong> 2 to 3 Days</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-900"></span>
                <span><strong className="text-slate-900 font-bold">Delivery Timeline (ડિલિવરી સમય):</strong> Within 7 to 10 Days across India</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">3. Delivery Charges</h2>
          <p>
            A minimal fixed store delivery fee of <strong>₹30</strong> applies to standard home delivery orders. Any promotional free delivery thresholds will be clearly indicated during checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">4. Order Tracking</h2>
          <p>
            You can check your order delivery status in real-time by visiting our <a href="/track-order" className="text-pink-600 font-bold hover:underline">Track Order Page (/track-order)</a> using your mobile number or Order ID.
          </p>
        </section>
      </div>
    </div>
  );
}
