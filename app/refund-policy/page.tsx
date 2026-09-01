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
          <h2 className="text-base font-extrabold text-slate-900 font-heading">2. Return &amp; Replacement Policy (રિટર્ન નીતિ)</h2>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2 text-slate-800">
            <div className="font-extrabold text-amber-900 flex items-center gap-2 text-sm font-heading">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <span>No Return Policy on Food Items (ફૂડ આઇટમ્સ માં કોઇ રિટર્ન નથી)</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              Because healthy seeds, superfoods, dry fruits, and grocery products are perishable food items, <strong>we do NOT accept returns once delivered</strong>.
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-200 p-4 rounded-2xl space-y-2 text-slate-800">
            <div className="font-extrabold text-pink-900 flex items-center gap-2 text-sm font-heading">
              📹 Mandatory Parcel Unboxing Video (પાર્સલ ખોલતા પહેલાં વીડિયો બનાવવો ફરજિયાત છે)
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              In case of any missing or damaged items inside the delivered parcel:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-800 font-semibold">
              <li>Customers <strong>MUST film a clear, uninterrupted video BEFORE opening the parcel package</strong>.</li>
              <li>The video must clearly show the courier shipping label, outer box seal, and the complete unboxing process.</li>
              <li>Claims for damaged or missing items without a continuous unboxing video recorded prior to package opening will not be accepted.</li>
              <li>Please share the unboxing video to our WhatsApp support (+91 7096396856) within 24 hours of delivery.</li>
            </ul>
          </div>
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
