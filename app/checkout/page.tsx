'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  Minus,
  Trash2,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { RAZORPAY_KEY_ID } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryCharge,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    landmark: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamically load Razorpay SDK Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition-colors cursor-pointer font-heading"
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

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();

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
      // 1. Create Order via Razorpay Backend API
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success || !orderData.order) {
        setErrorMsg(orderData.error || 'Failed to initiate Razorpay payment. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const rzpKey = orderData.keyId || RAZORPAY_KEY_ID;
      const razorpayOrder = orderData.order;

      // 2. Open Razorpay Official Payment Gateway Modal
      const options = {
        key: rzpKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Moxfood',
        description: 'Healthy Seeds & Grocery Order Payment',
        image: 'https://images.unsplash.com/photo-1509358271058-acd02cc93858?auto=format&fit=crop&w=150&q=80',
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment & Save Order to Database
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
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
                notes: formData.notes.trim(),
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success && verifyData.order) {
              clearCart();
              router.push(`/order-success/${verifyData.order.orderId}`);
            } else {
              setErrorMsg('Payment verification failed. Please contact store support.');
            }
          } catch (err: any) {
            setErrorMsg('Verification Error: ' + err.message);
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
        prefill: {
          name: formData.name.trim(),
          contact: formData.phone.trim(),
        },
        theme: {
          color: '#db2777', // Pink-600
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      setErrorMsg('Razorpay Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Navigation link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-pink-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer font-heading"
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
        {/* Step 1: Order Summary with Interactive Quantity Controls & Delete */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between font-heading">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-blue-900" />
              <span>1. {t('orderSummary')}</span>
            </div>
            <span className="text-xs text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-100 font-heading">
              {items.reduce((acc, item) => acc + item.quantity, 0)} {t('items')}
            </span>
          </h3>

          <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pb-3 border-b border-slate-100 font-medium"
              >
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
                      {item.unit} • ₹{item.price} / unit
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  {/* Quantity Counter Control (+ / -) */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-pink-50 hover:text-pink-600 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-black text-slate-900 text-xs font-heading">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal & Delete Trash Button */}
                  <div className="flex items-center gap-2">
                    <div className="font-extrabold text-slate-900 text-sm font-heading w-16 text-right">
                      ₹{item.price * item.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-2 font-semibold border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>{t('subtotal')}</span>
              <span className="font-bold text-slate-900 font-heading">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t('deliveryCharge')}</span>
              <span className="font-bold text-pink-600 font-heading">₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200 font-heading">
              <span>{t('payableTotal')}</span>
              <span className="text-blue-900 font-heading">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Customer Information & Delivery Address */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleRazorpayPayment} className="space-y-6">
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

            {/* Step 3: Razorpay Online Payment Gateway Section */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 font-heading">
                <CreditCard size={18} className="text-pink-600" />
                <span>3. {language === 'gu' ? 'ઓનલાઈન પેમેન્ટ પદ્ધતિ (Razorpay Gateway)' : 'Online Payment (Razorpay Payment Gateway)'}</span>
              </h3>

              <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-5 rounded-2xl space-y-3 shadow-md border border-blue-800">
                <div className="flex items-center gap-2 font-black text-white text-sm font-heading">
                  <Lock size={18} className="text-pink-400" />
                  <span>Secure 256-Bit Encrypted Razorpay Gateway</span>
                  <span className="bg-pink-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold ml-auto font-heading">
                    RAZORPAY
                  </span>
                </div>
                <p className="text-blue-100 font-semibold text-xs leading-relaxed">
                  {language === 'gu'
                    ? 'GPay, PhonePe, Paytm, BHIM, Debit/Credit Card અથવા Netbanking વડે તરત જ સુરક્ષિત ઓનલાઈન ચુકવણી કરો.'
                    : 'Pay instantly and securely using UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, or Netbanking.'}
                </p>
                <div className="text-[11px] text-pink-300 font-bold pt-0.5">
                  {t('noCodNotice')}
                </div>
              </div>
            </div>

            {/* Submit Razorpay Payment Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all text-sm sm:text-base disabled:opacity-50 cursor-pointer font-heading"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>{t('processingOrder')}</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>
                    {language === 'gu'
                      ? `Razorpay વડે ₹${grandTotal} ચૂકવો`
                      : `Pay ₹${grandTotal} via Razorpay`}
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="bg-blue-50/70 p-3.5 rounded-2xl text-[11px] text-blue-900 space-y-1 border border-blue-100">
            <div className="font-bold flex items-center gap-1 font-heading">
              <ShieldCheck size={14} className="text-pink-600" /> {t('qualityBadge')}
            </div>
            <div>You will receive instant updates and WhatsApp confirmation for your order.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
