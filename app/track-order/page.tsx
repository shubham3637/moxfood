'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Read from searchParams or localStorage on mount
    const paramQuery = searchParams.get('query') || searchParams.get('orderId') || searchParams.get('phone');
    const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('moxfood_phone') : null;

    const initialQuery = paramQuery || savedPhone || '';
    if (initialQuery) {
      setQueryInput(initialQuery);
      fetchOrderTracking(initialQuery);
    }
  }, [searchParams]);

  const fetchOrderTracking = async (searchStr: string) => {
    if (!searchStr.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(searchStr.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        // Save phone to localStorage if it's numeric
        if (/^\d{10}$/.test(searchStr.trim())) {
          localStorage.setItem('moxfood_phone', searchStr.trim());
        }
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Order tracking fetch error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderTracking(queryInput);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Processing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const statusTimeline = [
    { key: 'Pending', labelEn: 'Order Placed', labelGu: 'ઓર્ડર બુક થયેલ છે', icon: Clock },
    { key: 'Processing', labelEn: 'Packing & Ready', labelGu: 'પેકિંગ ચાલુ છે', icon: Package },
    { key: 'Out for Delivery', labelEn: 'Out for Delivery', labelGu: 'ડિલિવરી માટે નીકળેલ છે', icon: Truck },
    { key: 'Delivered', labelEn: 'Delivered', labelGu: 'સફળતાપૂર્વક ડિલિવર થયેલ છે', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Page Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-pink-200 font-heading">
          <Truck size={14} />
          <span>{language === 'gu' ? 'લાઇવ ઓર્ડર ટ્રેકિંગ' : 'Live Order Tracking'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
          {language === 'gu' ? 'તમારો ઓર્ડર ટ્રેક કરો (Track Order)' : 'Track Your Order Status'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
          {language === 'gu'
            ? 'તમારો વોટ્સએપ મોબાઈલ નંબર અથવા ઓર્ડર નંબર દાખલ કરી લાઈવ ડિલિવરી સ્ટેટસ જુઓ'
            : 'Enter your Mobile Number or Order ID to check your live order delivery status'}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-lg max-w-2xl mx-auto space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder={
                language === 'gu' ? 'મોબાઈલ નંબર (e.g. 7096396856) અથવા Order ID...' : 'Enter Mobile No. (e.g. 7096396856) or Order ID...'
              }
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm rounded-2xl pl-11 pr-4 py-3.5 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs sm:text-sm shrink-0"
          >
            {loading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <>
                <Search size={18} />
                <span>{language === 'gu' ? 'ઓર્ડર ટ્રેક કરો' : 'Track Order'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Hint */}
        <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-1">
          <span>💡 Tip: Enter the 10-digit mobile number used during checkout.</span>
          {searched && orders.length > 0 && (
            <span className="font-extrabold text-pink-600">Found {orders.length} order(s)</span>
          )}
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
          <p className="text-xs font-bold text-slate-600">Fetching order details...</p>
        </div>
      ) : searched && orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
          <AlertCircle size={40} className="text-pink-500 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base font-heading">
            {language === 'gu' ? 'કોઈ ઓર્ડર મળ્યો નથી' : 'No Orders Found'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'gu'
              ? 'દાખલ કરેલા મોબાઈલ નંબર અથવા ઓર્ડર ID માટે કોઈ વિગત મળી નથી. કૃપા કરીને સાચો નંબર નાખો.'
              : 'No orders found matching your search term. Please verify your 10-digit mobile number.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.status);
            const isCancelled = order.status === 'Cancelled';
            const isExpanded = expandedOrderId === order.orderId;

            return (
              <div
                key={order._id || order.orderId}
                className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-4 p-5 sm:p-6 transition-all hover:shadow-xl"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm sm:text-base font-heading">
                        Order #{order.orderId}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold font-heading ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {order.paymentStatus === 'Paid' ? 'PREPAID PAID' : 'PAYMENT PENDING'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 pt-0.5">
                      <Calendar size={12} />
                      <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                      <span className="text-base font-black text-pink-600 font-heading">₹{order.totalAmount}</span>
                    </div>

                    <a
                      href={`https://wa.me/917096396856?text=${encodeURIComponent(
                        `Hello Moxfood, I need update regarding my Order #${order.orderId} (Mobile: ${order.customerDetails.phone})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-2xl flex items-center gap-1 text-xs font-bold shadow-md transition-colors cursor-pointer"
                      title="Help on WhatsApp"
                    >
                      <MessageCircle size={16} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Status Timeline Visual Bar */}
                {isCancelled ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 flex items-center gap-3 text-xs font-bold">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>
                      <div>Order Cancelled</div>
                      <div className="text-[11px] opacity-80 font-normal">
                        This order was cancelled. If you have any questions, please contact Moxfood support.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {statusTimeline.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isCompleted = currentStep >= stepNum;
                        const isCurrent = currentStep === stepNum;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center space-y-1.5 relative">
                            {/* Icon Circle */}
                            <div
                              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              } ${isCurrent ? 'ring-4 ring-pink-100 scale-105' : ''}`}
                            >
                              <StepIcon size={18} />
                            </div>

                            {/* Step Label */}
                            <span
                              className={`text-[10px] sm:text-xs font-heading font-extrabold ${
                                isCompleted ? 'text-slate-900' : 'text-slate-400'
                              }`}
                            >
                              {language === 'gu' ? step.labelGu : step.labelEn}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Toggle Order Details Button */}
                <button
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Item Details' : 'View Ordered Items & Receipt'}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Expanded Order Items Receipt */}
                {isExpanded && (
                  <div className="space-y-4 pt-2 border-t border-slate-100 text-xs animate-fade-in">
                    {/* Items List */}
                    <div className="space-y-2">
                      <h4 className="font-black text-slate-800 uppercase tracking-wider text-[11px] font-heading">
                        Ordered Items ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0">
                                  📦
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-extrabold text-slate-900 truncate font-heading">{item.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {item.unit} • Qty: {item.quantity} × ₹{item.price}
                                </div>
                              </div>
                            </div>
                            <span className="font-black text-slate-900 font-heading shrink-0">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                        <div className="font-extrabold text-slate-900 font-heading flex items-center gap-1">
                          <MapPin size={14} className="text-pink-600" />
                          <span>Delivery Details</span>
                        </div>
                        <p className="font-semibold text-slate-700">{order.customerDetails?.name}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                          {order.customerDetails?.address}, Pincode: {order.customerDetails?.pincode}
                        </p>
                        {order.customerDetails?.landmark && (
                          <p className="text-[10px] text-slate-400">Landmark: {order.customerDetails.landmark}</p>
                        )}
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                        <div className="font-extrabold text-slate-900 font-heading flex items-center gap-1">
                          <ShieldCheck size={14} className="text-emerald-600" />
                          <span>Payment Breakdown</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal:</span>
                          <span className="font-bold">₹{order.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Store Delivery:</span>
                          <span className="font-bold">₹{order.deliveryCharge}</span>
                        </div>
                        <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200">
                          <span>Total Amount:</span>
                          <span className="text-pink-600 font-heading">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
