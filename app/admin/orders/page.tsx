'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Phone,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [activeStatusTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/orders';
      if (activeStatusTab !== 'all') {
        url += `?status=${activeStatusTab}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert('Status update failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert('Payment status update failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Error updating payment status: ' + err.message);
    }
  };

  const getWhatsAppUpdateUrl = (order: any) => {
    const text = `Hello ${order.customerDetails.name},\n\nYour Gautam Trading Order #${order.orderId} status has been updated to: *${order.status}*.\n\nTotal Amount: ₹${order.totalAmount}\nContact us for any questions. Thank you!`;
    return `https://wa.me/91${order.customerDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Order Management
        </h1>
        <p className="text-xs text-slate-500">Track customer orders and update delivery & payment statuses</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        {['all', 'Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setActiveStatusTab(st)}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeStatusTab === st
                ? 'bg-pink-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st === 'all' ? 'All Orders' : st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw size={32} className="animate-spin text-pink-600 mx-auto" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
          <ShoppingBag size={32} className="text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">No Orders Found</h3>
          <p className="text-xs text-slate-400">No orders found for this status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-pink-300 transition-colors"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-pink-600 text-base bg-pink-50 px-3 py-1 rounded-xl border border-pink-200">
                    #{ord.orderId}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(ord.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                {/* Status Update Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Payment Status */}
                  <select
                    value={ord.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(ord.orderId, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                      ord.paymentStatus === 'Paid'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-pink-100 text-pink-900 border-pink-300'
                    }`}
                  >
                    <option value="Pending">Payment: Pending</option>
                    <option value="Paid">Payment: Paid</option>
                  </select>

                  {/* Delivery Status */}
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                      ord.status === 'Delivered'
                        ? 'bg-blue-900 text-white border-blue-950'
                        : ord.status === 'Out for Delivery'
                        ? 'bg-pink-600 text-white border-pink-700'
                        : ord.status === 'Cancelled'
                        ? 'bg-red-600 text-white border-red-700'
                        : 'bg-amber-400 text-slate-950 border-amber-500'
                    }`}
                  >
                    <option value="Pending">Status: Pending</option>
                    <option value="Processing">Status: Processing</option>
                    <option value="Out for Delivery">Status: Out for Delivery</option>
                    <option value="Delivered">Status: Delivered</option>
                    <option value="Cancelled">Status: Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Info & WhatsApp Chat */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-8 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>{ord.customerDetails.name}</span>
                    <a
                      href={getWhatsAppUpdateUrl(ord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-600 hover:bg-pink-500 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <MessageSquare size={12} /> WhatsApp Update
                    </a>
                  </div>
                  <div className="text-slate-600 flex items-center gap-1 font-mono">
                    <Phone size={12} /> +91 {ord.customerDetails.phone}
                  </div>
                  <div className="text-slate-700 pt-1">
                    <strong>Address:</strong> {ord.customerDetails.address}
                  </div>
                  {ord.customerDetails.pincode && (
                    <div className="text-slate-700">
                      <strong>PIN Code:</strong> <span className="font-bold text-pink-600">{ord.customerDetails.pincode}</span>
                    </div>
                  )}
                  {ord.customerDetails.landmark && (
                    <div className="text-slate-500 text-[11px]">
                      Landmark: {ord.customerDetails.landmark}
                    </div>
                  )}
                  <div className="text-slate-500 pt-0.5 text-[11px]">
                    Payment Method: <strong>{ord.paymentMethod}</strong>
                  </div>
                </div>

                <div className="md:col-span-4 bg-pink-50/60 p-4 rounded-2xl border border-pink-200/80 flex flex-col justify-between">
                  <div className="space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-bold">₹{ord.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span className="font-bold">₹{ord.deliveryCharge}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-pink-200 font-heading">
                    <span>Total Amount:</span>
                    <span className="text-blue-900 text-base">₹{ord.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ordered Items ({ord.items.length} Items):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {ord.items.map((it: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs"
                    >
                      {it.image && (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-8 h-8 object-contain rounded bg-slate-50 p-0.5 border border-slate-200 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-800 truncate font-heading">{it.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {it.unit} x {it.quantity} = <strong>₹{it.price * it.quantity}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
