import React from 'react';
import { ShieldCheck, FileText, CheckSquare } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata = {
  title: 'Terms & Conditions - Moxfood Store',
  description: 'Official Terms & Conditions governing online orders, payments, pricing, and service use on Moxfood.',
  alternates: {
    canonical: getCanonicalUrl('/terms-conditions'),
  },
};

export default function TermsConditionsPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
        <div className="border-b border-slate-100 pb-4 space-y-2">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-extrabold text-xs px-3.5 py-1 rounded-full border border-pink-200 font-heading">
            <FileText size={14} />
            <span>TERMS OF SERVICE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last updated: August 21, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">1. General Terms</h2>
          <p>
            By accessing and placing an order on <strong className="text-slate-900 font-bold">Moxfood</strong> (moxfood.com), you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">2. Product Pricing & Descriptions</h2>
          <p>
            We strive to present accurate product descriptions, weights, pack sizes, and prices for all raw & roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds, and grocery items. All prices displayed are in Indian Rupees (INR) and include applicable taxes. We reserve the right to revise prices or update product availability without prior notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">3. Orders & Online Payments</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Orders are processed upon successful online payment confirmation via Razorpay UPI, GPay, PhonePe, Paytm, Cards, or Netbanking.</li>
            <li>Cash on Delivery (COD) availability depends on store policy and specific pin-code eligibility.</li>
            <li>We reserve the right to decline or cancel an order in cases of stock unavailability or incorrect delivery address information.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">4. Customer Responsibilities</h2>
          <p>
            Customers must provide accurate delivery address details and a valid 10-digit WhatsApp mobile number to ensure timely delivery in Surat.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">5. Governing Law</h2>
          <p>
            These Terms & Conditions are governed by and construed in accordance with the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat.
          </p>
        </section>
      </div>
    </div>
  );
}
