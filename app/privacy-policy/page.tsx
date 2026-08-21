import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata = {
  title: 'Privacy Policy - Moxfood Healthy Seeds & Grocery',
  description: 'Official Privacy Policy of Moxfood Store outlining data protection, customer privacy, payment security, and cookie policies.',
  alternates: {
    canonical: getCanonicalUrl('/privacy-policy'),
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
        <div className="border-b border-slate-100 pb-4 space-y-2">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-extrabold text-xs px-3.5 py-1 rounded-full border border-pink-200 font-heading">
            <Lock size={14} />
            <span>LEGAL DOCUMENT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 21, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">1. Introduction & Overview</h2>
          <p>
            Welcome to <strong className="text-slate-900 font-bold">Moxfood</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We operate the Moxfood online healthy seeds and grocery store (moxfood.com). We are committed to safeguarding the privacy and personal information of our customers in accordance with Indian IT laws and standard e-commerce security protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">2. Information We Collect</h2>
          <p>When you browse or place an order on Moxfood, we collect the following essential customer details:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong className="text-slate-800">Customer Details:</strong> Full Name, WhatsApp Mobile Number, Delivery Address, Pincode, and nearby Landmarks.</li>
            <li><strong className="text-slate-800">Order Information:</strong> Ordered items, delivery slots, total payment amounts, and order timestamps.</li>
            <li><strong className="text-slate-800">Payment Data:</strong> Online prepaid transaction reference numbers (Razorpay payment ID, UPI transaction ID). We <em>never</em> store your credit card numbers, CVV, or bank credentials on our servers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">3. How We Use Your Information</h2>
          <p>We use your information solely for the following business purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>To process, pack, and deliver your grocery and healthy seed orders to your doorstep.</li>
            <li>To send order confirmation receipts and live status notifications via WhatsApp or SMS.</li>
            <li>To verify prepaid online payments via secure Razorpay UPI / Cards payment gateway.</li>
            <li>To provide responsive customer support and resolve order inquiries.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">4. Data Protection & Payment Security</h2>
          <p>
            Your data is stored on secure, encrypted servers. All online transactions are processed through Razorpay PCI-DSS compliant gateways using 256-bit SSL encryption. We do not sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">5. Contact Us Regarding Privacy</h2>
          <p>
            If you have any questions regarding our Privacy Policy or wish to update your stored contact details, please contact us at:
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold space-y-1 text-xs">
            <p className="text-slate-900 font-bold font-heading">Moxfood Customer Support</p>
            <p>Phone: +91 7096396856</p>
            <p>Location: Surat, Gujarat, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
