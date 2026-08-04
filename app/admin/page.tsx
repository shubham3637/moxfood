'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      const products = prodData.products || [];
      const lowStock = products.filter((p: any) => p.stock <= 10).length;

      const orderRes = await fetch('/api/orders');
      const orderData = await orderRes.json();
      const orders = orderData.orders || [];

      const sales = orders
        .filter((o: any) => o.status !== 'Cancelled')
        .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalSales: sales,
        totalOrders: orders.length,
        totalProducts: products.length,
        lowStockCount: lowStock,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw size={32} className="animate-spin text-pink-600" />
        <p className="text-sm font-bold text-slate-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500">Gautam Trading Store sales and inventory analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products?action=new"
            className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Total Revenue</div>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{stats.totalSales}</div>
            <div className="text-[11px] text-pink-600 font-semibold mt-1">Completed order sales</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Total Orders</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalOrders}</div>
            <div className="text-[11px] text-slate-500 mt-1">Customer bookings</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Active Products</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalProducts}</div>
            <div className="text-[11px] text-blue-900 font-semibold mt-1">Catalog items count</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Low Stock Alerts</div>
            <div className="text-2xl font-black text-pink-600 mt-1">{stats.lowStockCount}</div>
            <div className="text-[11px] text-pink-700 font-semibold mt-1">Items below 10 qty</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Recent Orders</h3>
            <p className="text-xs text-slate-500">Latest customer orders and fulfillment status</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No orders received yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Mobile</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-pink-600">#{ord.orderId}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{ord.customerDetails?.name}</td>
                    <td className="py-3 px-3 text-slate-600">{ord.customerDetails?.phone}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">₹{ord.totalAmount}</td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          ord.status === 'Delivered'
                            ? 'bg-blue-100 text-blue-900'
                            : ord.status === 'Out for Delivery'
                            ? 'bg-pink-100 text-pink-900'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
