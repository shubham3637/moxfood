'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  MapPin,
  User,
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import UPIQRModal from '@/components/UPIQRModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryCharge, grandTotal, clearCart } = useCart();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    deliverySlot: 'Morning (8:00 AM - 11:00 AM)',
    paymentMethod: 'UPI' as 'UPI', // Only Online Prepaid UPI Pay
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showUPIModal, setShowUPIModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl text-center border border-slate-200 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 font-heading">{t('cartEmpty')}</h2>
        <p className="text-xs text-slate-500 font-medium">{t('cartEmptySub')}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t('heroButton')}</span>
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg(language === 'gu' ? 'મહેરબાની કરીને તમારું પૂરું નામ, મોબાઈલ નંબર અને સરનામું દાખલ કરો.' : 'Please enter your full name, 10-digit mobile number, and address.');
      return;
    }

    if (formData.phone.trim().length < 10) {
      setErrorMsg(language === 'gu' ? 'મહેરબાની કરીને સાચો 10-અંકનો મોબાઈલ નંબર દાખલ કરો.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerDetails: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          landmark: formData.landmark.trim(),
          deliverySlot: formData.deliverySlot,
        },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          altNameGujarati: item.altNameGujarati || '',
          unit: item.unit,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        paymentMethod: 'UPI', // Online Prepaid Pay
        notes: formData.notes.trim(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();
        router.push(`/order-success/${data.order.orderId}`);
      } else {
        setErrorMsg(data.error || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg(language === 'gu' ? 'મહેરબાની કરીને તમારું પૂરું નામ, મોબાઈલ નંબર અને સરનામું દાખલ કરો.' : 'Please enter your full name, 10-digit mobile number, and address.');
      return;
    }
    // Show instant UPI QR code modal
    setShowUPIModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* UPI QR Code Scanner Modal */}
      <UPIQRModal
        amount={grandTotal}
        orderId="Pending"
        isOpen={showUPIModal}
        onClose={() => setShowUPIModal(false)}
        onPaymentConfirmed={() => {
          setShowUPIModal(false);
          handlePlaceOrder();
        }}
      />

      {/* Navigation link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-pink-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>{t('backToStore')}</span>
      </Link>

      <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading">
        {t('checkoutTitle')}
      </h1>

      {errorMsg && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-800 text-xs font-extrabold rounded-2xl">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Info */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 font-heading">
                <User size={18} className="text-pink-600" />
                <span>{t('custInfo')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('mobile')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address & Slot */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 font-heading">
                <MapPin size={18} className="text-pink-600" />
                <span>{t('deliveryAddressSlot')}</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullAddress')}
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  placeholder="House No, Society / Flat Name, Street & City..."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('landmark')}
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="e.g. Near Shiv Temple"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('deliverySlot')}
                  </label>
                  <select
                    name="deliverySlot"
                    value={formData.deliverySlot}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer font-semibold"
                  >
                    <option value="Morning (8:00 AM - 11:00 AM)">Morning (8:00 AM - 11:00 AM)</option>
                    <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                    <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method (Prepaid Online UPI Only) */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 font-heading">
                <CreditCard size={18} className="text-pink-600" />
                <span>{t('paymentMethodTitle')}</span>
              </h3>

              <div className="bg-pink-50 border-2 border-pink-500 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-black text-pink-900 text-sm font-heading">
                  <QrCode size={20} className="text-pink-600" />
                  <span>{t('prepaidNotice')}</span>
                  <span className="bg-pink-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto">ONLINE PAY</span>
                </div>
                <p className="text-pink-900 font-semibold text-xs leading-relaxed">
                  {t('prepaidDesc')}
                </p>
                <div className="text-[11px] text-pink-700 font-bold pt-1">
                  {t('noCodNotice')}
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('orderNotes')}
              </label>
              <input
                type="text"
                name="notes"
                placeholder="e.g. Call before coming for delivery..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>{t('processingOrder')}</span>
                </>
              ) : (
                <>
                  <QrCode size={20} />
                  <span>{t('confirmOrder', { amount: grandTotal })}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 self-start">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 font-heading">
            <ShoppingBag size={18} className="text-blue-900" />
            <span>{t('orderSummary')}</span>
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-contain bg-slate-50 p-1 rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate font-heading">
                      {language === 'gu' && item.altNameGujarati ? item.altNameGujarati : item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      {item.unit} x {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-slate-900 shrink-0 font-heading">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-2 font-semibold">
            <div className="flex justify-between text-slate-600">
              <span>{t('subtotal')}</span>
              <span className="font-bold text-slate-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t('deliveryCharge')}</span>
              <span className="font-bold text-pink-600">
                {deliveryCharge === 0 ? t('free') : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200 font-heading">
              <span>{t('payableTotal')}</span>
              <span className="text-blue-900">₹{grandTotal}</span>
            </div>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-2xl text-[11px] text-blue-900 space-y-1 border border-blue-100">
            <div className="font-bold flex items-center gap-1">
              <ShieldCheck size={14} className="text-pink-600" /> {t('qualityBadge')}
            </div>
            <div>You will receive instant updates and WhatsApp confirmation for your order.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
