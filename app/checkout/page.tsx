'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  MapPin,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  Truck,
  Scale,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Tag,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { RAZORPAY_KEY_ID } from '@/lib/constants';
import { calculateShippingFee } from '@/lib/shipping';

interface PincodeStatus {
  loading: boolean;
  verified: boolean;
  isGujarat: boolean;
  stateName: string;
  district: string;
  error: string;
}

// Helper to dynamically load Razorpay script on demand
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalWeightGrams,
  } = useCart();
  const { t, language } = useLanguage();

  // Preload Razorpay Script on mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Collapsible toggle for Bill Breakdown
  const [isBillDetailOpen, setIsBillDetailOpen] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: '',
    notes: '',
  });

  const [pincodeStatus, setPincodeStatus] = useState<PincodeStatus>({
    loading: false,
    verified: false,
    isGujarat: false,
    stateName: '',
    district: '',
    error: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Debounced India Post Pincode Lookup API
  useEffect(() => {
    const cleanPincode = formData.pincode.trim();

    if (cleanPincode.length !== 6 || !/^\d{6}$/.test(cleanPincode)) {
      setPincodeStatus({
        loading: false,
        verified: false,
        isGujarat: false,
        stateName: '',
        district: '',
        error: cleanPincode.length > 0 && cleanPincode.length !== 6 ? 'Pincode must be 6 digits' : '',
      });
      return;
    }

    const timer = setTimeout(async () => {
      setPincodeStatus((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPincode}`);
        const data = await response.json();

        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const firstPo = data[0].PostOffice[0];
          const state = firstPo.State || '';
          const district = firstPo.District || '';

          const isGuj = state.toLowerCase() === 'gujarat';

          setPincodeStatus({
            loading: false,
            verified: true,
            isGujarat: isGuj,
            stateName: state,
            district,
            error: '',
          });
        } else {
          setPincodeStatus({
            loading: false,
            verified: false,
            isGujarat: false,
            stateName: '',
            district: '',
            error: 'Invalid Pincode. Please check your 6-digit Pincode.',
          });
        }
      } catch (err) {
        console.error('Error fetching pincode:', err);
        setPincodeStatus({
          loading: false,
          verified: false,
          isGujarat: false,
          stateName: '',
          district: '',
          error: 'Failed to verify Pincode. Check connection.',
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.pincode]);

  // Dynamic Tier-Based Shipping Charge Calculation
  const billableKg = Math.max(1, Math.ceil(totalWeightGrams / 1000));

  // ONLY calculate shipping fee when pincode is 6-digit & verified
  const deliveryCharge = pincodeStatus.verified ? calculateShippingFee(totalWeightGrams, pincodeStatus.isGujarat) : 0;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const rawPayableTotal = subtotal + deliveryCharge - discountAmount;
  const payableTotal = Math.max(0, rawPayableTotal);

  const isMinWeightSatisfied = totalWeightGrams >= 1000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError('');
    setCouponLoading(true);

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.couponCode,
          discountAmount: data.discountAmount,
          message: data.message,
        });
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Failed to apply coupon');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Error applying coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const showError = (msg: string) => {
    alert(msg);
  };

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMinWeightSatisfied) {
      const msg =
        language === 'gu'
          ? 'ઓછામાં ઓછું ૧ કિલો (1000g) ઓર્ડર વજન હોવું ફરજિયાત છે. કૃપા કરીને કાર્ટમાં વધુ વસ્તુઓ ઉમેરો.'
          : 'Minimum order weight must be 1 kg (1000g) to place an order. Please add more items.';
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      const msg =
        language === 'gu'
          ? 'મહેરબાની કરીને તમારું પૂરું નામ, મોબાઈલ નંબર, સરનામું અને ૬-અંકનો પીનકોડ દાખલ કરો.'
          : 'Please enter your full name, 10-digit mobile number, delivery address, and 6-digit Pincode.';
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    if (formData.phone.trim().length < 10) {
      const msg =
        language === 'gu' ? 'મહેરબાની કરીને સાચો 10-અંકનો મોબાઈલ નંબર દાખલ કરો.' : 'Please enter a valid 10-digit mobile number.';
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    if (formData.pincode.trim().length !== 6 || !pincodeStatus.verified) {
      const msg =
        language === 'gu'
          ? 'મહેરબાની કરીને સાચો 6-અંકનો પિનકોડ દાખલ કરી વેરિફાય કરો.'
          : 'Please enter a valid 6-digit Pincode to calculate shipping fee.';
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // 0. Ensure Razorpay script is loaded dynamically
      const isRzpLoaded = await loadRazorpayScript();
      if (!isRzpLoaded || typeof window === 'undefined' || !(window as any).Razorpay) {
        const failMsg =
          language === 'gu'
            ? 'પેમેન્ટ ગેટવે લોડ થઈ શક્યો નથી. મહેરબાની કરીને ફરી પ્રયાસ કરો.'
            : 'Payment Gateway failed to load. Please check your internet connection.';
        setErrorMsg(failMsg);
        showError(failMsg);
        setIsSubmitting(false);
        return;
      }

      // 1. Create Order via Razorpay Backend API
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: payableTotal }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success || !orderData.order) {
        const failMsg = orderData.error || 'Failed to initiate Razorpay payment. Please try again.';
        setErrorMsg(failMsg);
        showError(failMsg);
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
        image: `${window.location.origin}/logo.png`,
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
                  state: pincodeStatus.stateName || (pincodeStatus.isGujarat ? 'Gujarat' : 'Out of Gujarat'),
                  district: pincodeStatus.district || '',
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
                deliveryCharge,
                couponCode: appliedCoupon?.code || '',
                discountAmount,
                weightSummary: {
                  totalWeightGrams,
                  billableKg,
                  shippingFee: deliveryCharge,
                },
                notes: formData.notes.trim(),
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success && verifyData.order) {
              clearCart();
              router.push(`/order-success/${verifyData.order._id}`);
            } else {
              const errTxt = verifyData.error || 'Payment verification failed.';
              setErrorMsg(errTxt);
              showError(errTxt);
              setIsSubmitting(false);
            }
          } catch (err: any) {
            console.error('Error saving order after payment:', err);
            const sysErr = err.message || 'Payment complete but order saving failed.';
            setErrorMsg(sysErr);
            showError(sysErr);
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name.trim(),
          contact: formData.phone.trim(),
        },
        theme: {
          color: '#db2777',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        const failMessage = response.error?.description || 'Payment Failed or Cancelled.';
        setErrorMsg(failMessage);
        showError(failMessage);
        setIsSubmitting(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      const catErr = err.message || 'An unexpected error occurred during checkout.';
      setErrorMsg(catErr);
      showError(catErr);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-20 h-20 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center mx-auto text-2xl">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-heading">{t('cartEmpty')}</h2>
        <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
          {t('cartEmptySub')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all text-xs cursor-pointer font-heading"
        >
          <ArrowLeft size={16} />
          <span>{t('backToHome')}</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6 pb-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-pink-600 hover:text-pink-700 transition-colors font-heading"
        >
          <ArrowLeft size={16} />
          <span>{t('backToStore')}</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          {t('checkoutTitle')}
        </h1>

        {/* 1 kg Minimum Order Weight Warning Alert */}
        {!isMinWeightSatisfied && (
          <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-extrabold rounded-2xl flex items-center gap-3">
            <AlertCircle size={22} className="text-amber-600 shrink-0" />
            <div>
              <div className="font-heading text-sm">
                {language === 'gu'
                  ? 'ઓછામાં ઓછું ૧ કિલો (1000g) વજન હોવું જરૂરી છે.'
                  : 'Minimum 1 kg (1000g) order weight required.'}
              </div>
              <div className="text-[11px] font-semibold text-amber-700 font-mono">
                {language === 'gu'
                  ? `હાલનું વજન: ${totalWeightGrams}g. કૃપા કરીને વધુ વસ્તુઓ ઉમેરી 1000g પૂરું કરો.`
                  : `Current weight: ${totalWeightGrams}g. Please add items to reach 1000g.`}
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl animate-shake flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-800 font-bold ml-2">✕</button>
          </div>
        )}

        <div className="space-y-6">
          {/* Step 1: Order Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between font-heading">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-900" />
                <span>1. {t('orderSummary')}</span>
              </div>
              <span className="text-xs text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-100 font-heading">
                {items.reduce((acc, item) => acc + item.quantity, 0)} {t('items')} •{' '}
                {totalWeightGrams < 1000 ? `${totalWeightGrams}g` : `${(totalWeightGrams / 1000).toFixed(1)}kg`}
              </span>
            </h3>

            {/* Purchased Products List */}
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
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Tag size={16} className="text-pink-600" />
              <span>{language === 'gu' ? 'ડિસ્કાઉન્ટ કુપન કોડ (Apply Coupon)' : 'Apply Promotional Coupon Code'}</span>
            </h3>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-extrabold text-emerald-900 font-heading font-mono">
                      {appliedCoupon.code} APPLIED (-₹{appliedCoupon.discountAmount})
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      {appliedCoupon.message}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1 text-emerald-700 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove Coupon"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. MOX10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="bg-slate-900 hover:bg-pink-600 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow transition-all disabled:opacity-40 cursor-pointer font-heading flex items-center gap-1 shrink-0"
                >
                  {couponLoading ? <RefreshCw size={14} className="animate-spin" /> : <span>Apply</span>}
                </button>
              </form>
            )}

            {couponError && (
              <div className="text-[11px] text-red-600 font-bold flex items-center gap-1 pt-1">
                <AlertCircle size={14} />
                <span>{couponError}</span>
              </div>
            )}
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
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
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
                      maxLength={10}
                      placeholder="10-digit WhatsApp Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
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
                    rows={2}
                    placeholder="House No, Building, Street Name, Area"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Postal Pincode *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        placeholder="e.g. 395006"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
                      />
                      {pincodeStatus.loading && (
                        <RefreshCw size={16} className="animate-spin text-pink-600 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('landmark')}
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="Near Temple / School / Hospital"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('orderNotes')}
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Optional delivery instructions"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Dispatch, Delivery & Return Policy Notice Card */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-slate-700 font-medium">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5 font-heading">
                      <Truck size={16} className="text-pink-600" />
                      <span>Dispatch: 2-3 Days • Delivery: 7-10 Days</span>
                    </span>
                    <span className="bg-pink-100 text-pink-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-pink-200 font-heading">
                      🚫 No Return on Food Items
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold leading-relaxed pt-0.5">
                    📹 <strong>Notice:</strong> જો પાર્સલમાં વસ્તુ મિસિંગ કે ડેમેજ હોય તો પાર્સલ ખોલતા પહેલાં વીડિયો બનાવવો ફરજિયાત છે. (Please record an unboxing video BEFORE opening parcel for damage/missing claims.)
                  </div>
                </div>

                {/* Submit Payment Button inside form */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isMinWeightSatisfied}
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm font-heading"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>{t('processingOrder')}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Pay Now ₹{payableTotal}</span>
                    </>
                  )}
                </button>
              </form>
          </div>
        </div>

        {/* Step 3: Bill Summary */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          {/* Bill Summary Section with Collapsible Toggle Disclosure */}
          <div className="space-y-3">
            {/* Clickable Toggle Disclosure Header */}
            <button
              type="button"
              onClick={() => setIsBillDetailOpen(!isBillDetailOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-md cursor-pointer font-heading"
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold flex items-center gap-1.5 text-pink-300">
                  <span>{language === 'gu' ? 'કુલ બિલ (Total Bill)' : 'Total Bill'}</span>
                  <span className="text-[10px] font-normal text-slate-300">
                    (Incl. taxes &amp; shipping charges)
                  </span>
                </span>
                <span className="text-base font-black text-white">₹{payableTotal}</span>
              </div>

              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/30 border border-white/10 text-pink-400">
                {isBillDetailOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {/* Collapsible Body */}
            {isBillDetailOpen && (
              <div className="space-y-2.5 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-fade-in font-semibold">
                <div className="flex justify-between text-slate-600">
                  <span>{t('subtotal')}</span>
                  <span className="font-bold text-slate-900 font-heading">₹{subtotal}</span>
                </div>

                {/* Total Weight Indicator */}
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Scale size={14} className="text-pink-600" />
                    <span>
                      {language === 'gu' ? 'કુલ વજન (Total Weight):' : 'Total Order Weight:'}
                    </span>
                  </span>
                  <span className="font-mono text-slate-800 font-bold">
                    {totalWeightGrams < 1000 ? `${totalWeightGrams} g` : `${(totalWeightGrams / 1000).toFixed(1)} kg`}
                  </span>
                </div>

                {/* Delivery Charge Row */}
                <div className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-1">
                    <Truck size={14} className="text-blue-900" />
                    <span>Shipping Fee:</span>
                  </div>
                  {pincodeStatus.verified ? (
                    <span className="font-bold text-pink-600 font-heading text-sm">₹{deliveryCharge}</span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Enter Pincode Above
                    </span>
                  )}
                </div>

                {/* Coupon Discount Row */}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="flex items-center gap-1 font-bold">
                      <Tag size={14} /> Coupon Discount ({appliedCoupon?.code}):
                    </span>
                    <span className="font-bold font-heading text-sm">- ₹{discountAmount}</span>
                  </div>
                )}

                {/* Pincode Error Banner */}
                {pincodeStatus.error && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-[11px] flex items-center gap-1.5 text-red-600 font-bold">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{pincodeStatus.error}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200 font-heading">
                  <span>{t('payableTotal')}</span>
                  <span className="text-blue-900 font-heading">₹{payableTotal}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Action Bar with "To Pay" Amount & "Pay Now" Button */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:px-10 shadow-2xl flex items-center justify-between gap-4 font-heading">
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              {language === 'gu' ? 'ચૂકવવાની રકમ (To Pay)' : 'To Pay'}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900">
              ₹{payableTotal}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRazorpayPayment}
            disabled={isSubmitting || !isMinWeightSatisfied}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base px-6 sm:px-10 py-3 sm:py-3.5 rounded-2xl shadow-lg shadow-pink-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer font-heading"
          >
            {isSubmitting ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <>
                <span>{language === 'gu' ? 'પેમેન્ટ કરો (Pay Now)' : 'Pay Now'}</span>
                <CreditCard size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
