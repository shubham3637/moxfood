'use client';

import React, { useEffect, useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Percent,
  DollarSign,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'fixed',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    validUntil: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      setError('Please provide coupon code and discount value.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount) || 0,
          maxDiscountAmount: Number(formData.maxDiscountAmount) || 0,
          validUntil: formData.validUntil || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Coupon '${data.coupon.code}' created successfully!`);
        setFormData({
          code: '',
          discountType: 'fixed',
          discountValue: '',
          minOrderAmount: '',
          maxDiscountAmount: '',
          validUntil: '',
        });
        setIsAdding(false);
        fetchCoupons();
      } else {
        setError(data.error || 'Failed to create coupon.');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon '${code}'?`)) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Coupon Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Create and manage promotional discount codes for Moxfood store
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer font-heading shrink-0"
        >
          <Plus size={16} />
          <span>{isAdding ? 'Cancel' : 'Create New Coupon'}</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-red-500 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Create Coupon Form Modal / Card */}
      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-heading">
            <Tag size={18} className="text-pink-600" />
            <span>Create Promotional Coupon Code</span>
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-medium">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MOX10 or DIWALI50"
                  value={formData.code}
                  onChange={handleInputChange}
                  name="code"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                >
                  <option value="fixed">Fixed Amount (₹ Off)</option>
                  <option value="percentage">Percentage (% Off)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Discount Value * ({formData.discountType === 'percentage' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder={formData.discountType === 'percentage' ? 'e.g. 10 for 10%' : 'e.g. 50 for ₹50'}
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  name="discountValue"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Min Order Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 300 (Optional)"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  name="minOrderAmount"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {formData.discountType === 'percentage' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 200 max discount"
                    value={formData.maxDiscountAmount}
                    onChange={handleInputChange}
                    name="maxDiscountAmount"
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  name="validUntil"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer font-heading flex items-center gap-1.5"
              >
                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Tag size={14} />}
                <span>Save Coupon</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List Table */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw size={32} className="animate-spin text-pink-600 mx-auto" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
          <Tag size={32} className="text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base font-heading">No Coupons Created Yet</h3>
          <p className="text-xs text-slate-400 font-medium">Click "Create New Coupon" above to add your first discount code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className={`bg-white rounded-3xl border p-5 shadow-sm space-y-3 transition-all ${
                coupon.isActive ? 'border-slate-200 hover:border-pink-300' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-pink-600 text-base bg-pink-50 px-3 py-1 rounded-xl border border-pink-200 uppercase tracking-wider">
                    {coupon.code}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      coupon.isActive
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600 font-medium">
                <div className="flex justify-between items-center text-slate-900 font-bold font-heading text-sm">
                  <span>Discount:</span>
                  <span className="text-pink-600">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </span>
                </div>

                {coupon.minOrderAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Min Order Subtotal:</span>
                    <span className="font-bold">₹{coupon.minOrderAmount}</span>
                  </div>
                )}

                {coupon.discountType === 'percentage' && coupon.maxDiscountAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Max Discount Cap:</span>
                    <span className="font-bold">₹{coupon.maxDiscountAmount}</span>
                  </div>
                )}

                {coupon.validUntil && (
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Valid Until:
                    </span>
                    <span>{new Date(coupon.validUntil).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer font-heading ${
                    coupon.isActive
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {coupon.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
