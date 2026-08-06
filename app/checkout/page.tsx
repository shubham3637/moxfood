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
  Hash,
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
    pincode: '',
    landmark: '',
    paymentMethod: 'UPI' as 'UPI',
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
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      setErrorMsg(
        language === 'gu'
          ? 'મહેરબાની કરીને તમારું પૂરું નામ, મોબાઈલ નંબર, સરનામું અને ૬-અંકનો પીનકોડ દાખલ કરો.'
          : 'Please enter your full name, 10-digit mobile number, delivery address, and 6-digit Pincode.'
      );
      return;
    }

    if (formData.phone.trim().length < 10) {
      setErrorMsg(
        language === 'gu' ? 'મહેરબાની કરીને સાચો 10-અંકનો મોબાઈલ નંબર દાખલ કરો.' : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (formData.pincode.trim().length !== 6) {
      setErrorMsg(
        language === 'gu' ? 'મહેરબાની કરીને સાચો 6-અંકનો પીનકોડ દાખલ કરો.' : 'Please enter a valid 6-digit Area Pincode.'
      );
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
          pincode: formData.pincode.trim(),
          landmark: formData.landmark.trim(),
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
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      setErrorMsg(
        language === 'gu'
          ? 'મહેરબાની કરીને તમારું પૂરું નામ, મોબાઈલ નંબર, સરનામું અને ૬-અંકનો પીનકોડ દાખલ કરો.'
          : 'Please enter your full name, 10-digit mobile number, delivery address, and 6-digit Pincode.'
      );
      return;
    }
    if (formData.pincode.trim().length !== 6) {
      setErrorMsg(
        language === 'gu' ? 'મહેરબાની કરીને સાચો 6-અંકનો પીનકોડ દાખલ કરો.' : 'Please enter a valid 6-digit Area Pincode.'
      );
      return;
    }
    // Show instant UPI QR code modal
    setShowUPIModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
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

      <div className="space-y-6">
        {/* Step 1: Order Summary (PLACED AT THE TOP) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between font-heading">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-blue-900" />
              <span>1. {t('orderSummary')}</span>
            </div>
            <span className="text-xs text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              {items.reduce((acc, item) => acc + item.quantity, 0)} {t('items')}
            </span>
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm font-heading truncate">
                      {language === 'gu' && item.altNameGujarati ? item.altNameGujarati : item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {item.unit} x {item.quantity} (₹{item.price}/unit)
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-slate-900 text-sm shrink-0 font-heading">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-2 font-semibold border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>{t('subtotal')}</span>
              <span className="font-bold text-slate-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t('deliveryCharge')}</span>
              <span className="font-bold text-pink-600">₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200 font-heading">
              <span>{t('payableTotal')}</span>
              <span className="text-blue-900">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Customer Information & Delivery Address (PLACED DIRECTLY BELOW ORDER SUMMARY) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-heading">
                <MapPin size={20} className="text-pink-600" />
                <span>2. {language === 'gu' ? 'ગ્રાહક અને ડિલિવરી સરનામું' : 'Customer & Delivery Address'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('fullName')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
                    />
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullAddress')}
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  placeholder="House No, Society / Flat Name, Street & Area..."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Compulsory Pincode Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{language === 'gu' ? '૬-અંકનો પિનકોડ *' : 'Area Pincode (6-digit) *'}</span>
                    <span className="text-[10px] text-pink-600 font-extrabold">{language === 'gu' ? 'ફરજિયાત' : 'COMPULSORY'}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="e.g. 388001"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-extrabold tracking-wider"
                    />
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" />
                  </div>
                </div>

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
            </div>

            {/* Step 3: Payment Method (Prepaid Online UPI Only) */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 font-heading">
                <CreditCard size={18} className="text-pink-600" />
                <span>3. {t('paymentMethodTitle')}</span>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all text-sm sm:text-base disabled:opacity-50 cursor-pointer font-heading"
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
