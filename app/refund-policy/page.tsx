import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata = {
  title: 'Cancellation & Refund Policy - Moxfood',
  description: 'Official Cancellation and Refund Policy for Moxfood online orders, returns eligibility, and Razorpay refund timelines.',
  alternates: {
    canonical: getCanonicalUrl('/refund-policy'),
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
        <div className="border-b border-slate-100 pb-4 space-y-2">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-extrabold text-xs px-3.5 py-1 rounded-full border border-pink-200 font-heading">
            <RefreshCw size={14} />
            <span>CANCELLATION & REFUNDS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">Cancellation & Refund Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 21, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">1. Order Cancellation Policy</h2>
          <p>
            Customers can cancel their order within <strong>15 minutes</strong> of placing it or before the order status transitions to &quot;Out for Delivery&quot;. To cancel an order, please contact our support team at <strong>+91 7096396856</strong> on WhatsApp.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">2. Return & Replacement Eligibility</h2>
          <p>
            Because healthy seeds and grocery products are perishable food items, returns are accepted under the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Product delivered was damaged, tampered, or defective upon delivery.</li>
            <li>Incorrect item or weight pack was delivered by error.</li>
            <li>Item delivered was past its expiration date.</li>
          </ul>
          <p className="text-xs text-slate-500 font-normal pt-1">
            * Note: Return requests must be initiated within 24 hours of delivery with photo proof sent to our WhatsApp support number.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">3. Refund Processing Timelines</h2>
          <p>
            Once a return or cancellation is approved, refunds are credited back to the customer’s original payment method (UPI / Bank / Card) via Razorpay payment gateway within <strong>5 to 7 business days</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading">4. Contact Support for Refunds</h2>
          <p>
            For any refund status inquiries, please contact our customer support team:
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold space-y-1 text-xs">
            <p className="text-slate-900 font-bold font-heading">Moxfood Refund Support</p>
            <p>WhatsApp / Call: +91 7096396856</p>
            <p>Location: Surat, Gujarat, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
