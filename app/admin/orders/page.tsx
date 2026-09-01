'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Phone,
  MessageSquare,
  RefreshCw,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const [pushingOrderId, setPushingOrderId] = useState<string | null>(null);

  const [recoverForm, setRecoverForm] = useState({
    paymentId: '',
    name: '',
    phone: '',
    address: '',
    pincode: '',
    landmark: '',
    itemSummary: '',
  });
  const [recovering, setRecovering] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [activeStatusTab]);

  const handleRecoverOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverForm.paymentId.trim()) return;

    setRecovering(true);
    try {
      const res = await fetch('/api/admin/recover-razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: recoverForm.paymentId.trim(),
          forceUpdate: true,
          customerDetails: {
            name: recoverForm.name.trim(),
            phone: recoverForm.phone.trim(),
            address: recoverForm.address.trim(),
            pincode: recoverForm.pincode.trim(),
            landmark: recoverForm.landmark.trim(),
          },
          items: recoverForm.itemSummary.trim()
            ? [
                {
                  productId: 'MANUAL-SYNC-101',
                  name: recoverForm.itemSummary.trim(),
                  unit: '1 kg',
                  price: 100,
                  quantity: 1,
                  image: '/logo.png',
                },
              ]
            : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Order synced successfully!');
        setRecoverForm({ paymentId: '', name: '', phone: '', address: '', pincode: '', landmark: '', itemSummary: '' });
        setShowRecoverModal(false);
        fetchOrders();
      } else {
        alert('Sync failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error syncing order: ' + err.message);
    } finally {
      setRecovering(false);
    }
  };

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

  const handlePushToShipmozo = async (orderId: string) => {
    setPushingOrderId(orderId);
    try {
      const res = await fetch('/api/shipmozo/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Successfully pushed order to Shipmozo panel!');
        fetchOrders();
      } else {
        alert('Shipmozo Push Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Shipmozo error: ' + err.message);
    } finally {
      setPushingOrderId(null);
    }
  };

  const getWhatsAppUpdateUrl = (order: any) => {
    const text = `Hello ${order.customerDetails.name},\n\nYour Moxfood Order #${order.orderId} status has been updated to: *${order.status}*.\n\nTotal Amount: ₹${order.totalAmount}\nContact us for any questions. Thank you!`;
    return `https://wa.me/91${order.customerDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Order &amp; Shipmozo Dispatch Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Track customer orders, auto-push to Shipmozo, and update delivery &amp; payment statuses
          </p>
        </div>

        <button
          onClick={() => setShowRecoverModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-2xl shadow-md transition-all text-xs font-heading flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Sync Missing Razorpay Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold font-heading">
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
          <h3 className="font-extrabold text-slate-800 text-base font-heading">No Orders Found</h3>
          <p className="text-xs text-slate-400 font-medium">No orders found for this status filter.</p>
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
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-black text-pink-600 text-base bg-pink-50 px-3 py-1 rounded-xl border border-pink-200">
                    #{ord.orderId}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(ord.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>

                  {ord.shipmozoPushed ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 font-heading">
                      <CheckCircle2 size={13} /> Pushed to Shipmozo
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePushToShipmozo(ord.orderId)}
                      disabled={pushingOrderId === ord.orderId}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow transition-all flex items-center gap-1 cursor-pointer font-heading"
                    >
                      {pushingOrderId === ord.orderId ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <Truck size={13} />
                      )}
                      <span>Push to Shipmozo</span>
                    </button>
                  )}
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
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer font-heading ${
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
                <div className="md:col-span-8 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5 font-medium">
                  <div className="font-bold text-slate-900 text-sm flex items-center justify-between font-heading">
                    <span>{ord.customerDetails.name}</span>
                    <a
                      href={getWhatsAppUpdateUrl(ord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-600 hover:bg-pink-500 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer font-heading"
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
                  {ord.shipmozoAwbNumber && (
                    <div className="text-blue-900 font-extrabold text-[11px] pt-1">
                      Shipmozo AWB: <span className="font-mono">{ord.shipmozoAwbNumber}</span> ({ord.shipmozoCourierName || 'Express Courier'})
                    </div>
                  )}
                  <div className="text-slate-500 pt-0.5 text-[11px]">
                    Payment Method: <strong>{ord.paymentMethod}</strong>
                  </div>
                </div>

                <div className="md:col-span-4 bg-pink-50/60 p-4 rounded-2xl border border-pink-200/80 flex flex-col justify-between font-semibold">
                  <div className="space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-bold text-slate-900 font-heading">₹{ord.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span className="font-bold text-pink-600 font-heading">₹{ord.deliveryCharge}</span>
                    </div>
                    {ord.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Coupon ({ord.couponCode || 'DISCOUNT'}):</span>
                        <span className="font-bold font-heading">- ₹{ord.discountAmount}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-pink-200 font-heading">
                    <span>Total Amount:</span>
                    <span className="text-blue-900 text-base font-heading">₹{ord.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                  Ordered Items ({ord.items.length} Items):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {ord.items.map((it: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-medium"
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

      {/* Recover Missing Razorpay Order Modal */}
      {showRecoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-medium">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 font-heading">
                Sync / Recover Missing Razorpay Order
              </h3>
              <button
                onClick={() => setShowRecoverModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Enter the <strong>Razorpay Payment ID</strong> from your Razorpay Dashboard (e.g. <span className="font-mono text-pink-600">pay_TWkcm7opthXGYz</span>). The system will fetch the payment from Razorpay and automatically create the order in your database &amp; push it to Shipmozo!
            </p>

            <form onSubmit={handleRecoverOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1 font-heading">
                  Razorpay Payment ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. pay_TWkcm7opthXGYz"
                  value={recoverForm.paymentId}
                  onChange={(e) => setRecoverForm({ ...recoverForm, paymentId: e.target.value.trim() })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                  Optional Details Override / Fill (મરજિયાત વિગતો):
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5 font-heading">
                      Full Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={recoverForm.name}
                      onChange={(e) => setRecoverForm({ ...recoverForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5 font-heading">
                      WhatsApp Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9624719200"
                      value={recoverForm.phone}
                      onChange={(e) => setRecoverForm({ ...recoverForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5 font-heading">
                    Full Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="House/Plot No, Street, Area, City"
                    value={recoverForm.address}
                    onChange={(e) => setRecoverForm({ ...recoverForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5 font-heading">
                      Postal PIN Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 395006"
                      value={recoverForm.pincode}
                      onChange={(e) => setRecoverForm({ ...recoverForm, pincode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5 font-heading">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="Near Temple/School"
                      value={recoverForm.landmark}
                      onChange={(e) => setRecoverForm({ ...recoverForm, landmark: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5 font-heading">
                    Ordered Items Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Raw Pumpkin Seeds 1kg, Chia Seeds 500g"
                    value={recoverForm.itemSummary}
                    onChange={(e) => setRecoverForm({ ...recoverForm, itemSummary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRecoverModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold font-heading hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recovering || !recoverForm.paymentId}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow font-heading flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {recovering ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <span>Sync &amp; Save Order</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
