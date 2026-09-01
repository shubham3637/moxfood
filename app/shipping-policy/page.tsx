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
          <h2 className="text-base font-extrabold text-slate-900 font-heading">3. Delivery Charges Rate Card (શિપિંગ ચાર્જ દરો)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            {/* Gujarat Rates */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-600"></span>
                <span>Gujarat (ગુજરાત શિપિંગ ચાર્જ)</span>
              </h3>
              <ul className="space-y-1 text-slate-700 font-semibold font-mono">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>1 kg:</span> <span>₹40</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>2 kg:</span> <span>₹60</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>3 kg:</span> <span>₹100</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>4 kg &amp; 5 kg:</span> <span>₹140</span>
                </li>
                <li className="flex justify-between text-pink-600 font-bold">
                  <span>&gt;5 kg:</span> <span>₹40 × kg</span>
                </li>
              </ul>
            </div>

            {/* Out of Gujarat Rates */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-900"></span>
                <span>Out of Gujarat (ગુજરાત બહાર શિપિંગ ચાર્જ)</span>
              </h3>
              <ul className="space-y-1 text-slate-700 font-semibold font-mono">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>1 kg:</span> <span>₹60</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>2 kg:</span> <span>₹90</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>3 kg:</span> <span>₹120</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>4 kg &amp; 5 kg:</span> <span>₹180</span>
                </li>
                <li className="flex justify-between text-blue-900 font-bold">
                  <span>&gt;5 kg:</span> <span>₹60 × kg</span>
                </li>
              </ul>
            </div>
          </div>
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
