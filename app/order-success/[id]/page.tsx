'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShoppingBag,
  Home,
  RefreshCw,
} from 'lucide-react';

export default function OrderSuccessPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to fetch order success page details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw size={32} className="animate-spin text-pink-600" />
        <p className="text-sm font-bold text-slate-600">Loading order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl text-center border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-800 font-heading">Order Not Found</h2>
        <Link href="/" className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer font-heading">
          <Home size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const storePhone = '919876543210';
  const whatsappText = `🛒 *GAUTAM TRADING - ORDER RECEIPT* 🛒
*Order ID:* #${order.orderId}
*Customer Name:* ${order.customerDetails.name}
*Phone Number:* ${order.customerDetails.phone}
*Delivery Address:* ${order.customerDetails.address}
*PIN Code:* ${order.customerDetails.pincode || 'N/A'}
*Payment Method:* ${order.paymentMethod} (${order.paymentStatus})

*Ordered Items:*
${order.items.map((it: any) => `• ${it.name} (${it.unit}) x ${it.quantity} = ₹${it.price * it.quantity}`).join('\n')}

*Total Amount:* ₹${order.totalAmount}

Please process home delivery for this order. Thank you!`;

  const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Success Card Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={48} />
        </div>

        <div>
          <div className="inline-block bg-blue-100 text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full mb-2 border border-blue-200 font-heading">
            Order Placed Successfully
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
            Thank you! Your Order Has Been Received.
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Thank you for shopping at Gautam Trading.
          </p>
        </div>

        {/* Order ID Badge */}
        <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 inline-block">
          <span className="text-xs text-slate-600 font-medium">Order ID: </span>
          <span className="font-mono font-black text-pink-600 text-base ml-1">
            #{order.orderId}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs transition-all cursor-pointer font-heading"
          >
            <MessageSquare size={18} />
            <span>Send Order Receipt to Store on WhatsApp</span>
          </a>

          <Link
            href="/"
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer font-heading"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 font-heading">
          <ShoppingBag size={18} className="text-blue-900" />
          <span>Order Receipt Details</span>
        </h3>

        {/* Delivery & Customer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-1.5">
            <div className="font-extrabold text-blue-950 flex items-center gap-1.5 font-heading">
              <MapPin size={14} className="text-pink-600" />
              <span>Customer Details & Address</span>
            </div>
            <div className="text-slate-800 font-bold font-heading">{order.customerDetails.name}</div>
            <div className="text-slate-600 flex items-center gap-1 font-mono">
              <Phone size={12} /> {order.customerDetails.phone}
            </div>
            <div className="text-slate-600 leading-relaxed pt-1">{order.customerDetails.address}</div>
            {order.customerDetails.pincode && (
              <div className="text-slate-700">
                <strong>PIN Code:</strong> <span className="font-bold text-pink-600">{order.customerDetails.pincode}</span>
              </div>
            )}
            {order.customerDetails.landmark && (
              <div className="text-slate-500 text-[11px]">Landmark: {order.customerDetails.landmark}</div>
            )}
          </div>

          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-1.5">
            <div className="font-extrabold text-blue-950 flex items-center gap-1.5 font-heading">
              <Clock size={14} className="text-pink-600" />
              <span>Delivery & Payment Status</span>
            </div>
            <div className="text-slate-700">
              Payment Method: <span className="font-bold text-blue-900">{order.paymentMethod}</span>
            </div>
            <div className="text-slate-700">
              Payment Status: <span className="font-bold text-pink-600">{order.paymentStatus}</span>
            </div>
            <div className="pt-1">
              Status: <span className="bg-pink-100 text-pink-900 font-bold px-2 py-0.5 rounded text-[11px] border border-pink-200">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-700 font-heading">Ordered Items:</h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50/50 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-800 font-heading">{item.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Unit: {item.unit} | Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-extrabold text-slate-900 font-heading">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-200 space-y-1.5 text-xs font-semibold">
          <div className="flex justify-between text-slate-700">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Delivery Charge:</span>
            <span className="font-bold text-pink-600">₹{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-pink-200 font-heading">
            <span>Total Amount:</span>
            <span className="text-blue-900">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
