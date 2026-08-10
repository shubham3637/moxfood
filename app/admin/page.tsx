'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Package,
  Grid,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, catRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);

      const ordData = await ordRes.json();
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      const orders = ordData.orders || [];
      const products = prodData.products || [];
      const categories = catData.categories || [];

      const revenue = orders.reduce(
        (sum: number, o: any) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0),
        0
      );
      const pending = orders.filter((o: any) => o.status === 'Pending').length;

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCategories: categories.length,
        totalRevenue: revenue,
        pendingOrders: pending,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium">Moxfood Store sales and inventory analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer font-heading"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-pink-600">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-heading">Total Sales</span>
            <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">₹{stats.totalRevenue}</div>
          <p className="text-[11px] text-pink-600 font-bold">Lifetime store earnings</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-900">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-heading">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{stats.totalOrders}</div>
          <p className="text-[11px] text-blue-900 font-bold">{stats.pendingOrders} pending dispatch</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-heading">Active Products</span>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{stats.totalProducts}</div>
          <p className="text-[11px] text-slate-500 font-medium">Items listed in store</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-heading">Categories</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
              <Grid size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{stats.totalCategories}</div>
          <p className="text-[11px] text-purple-600 font-bold">Catalog sections</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 font-heading">
            <TrendingUp size={18} className="text-pink-600" />
            <span>Recent Customer Orders</span>
          </h3>
          <Link href="/admin/orders" className="text-xs text-pink-600 hover:text-pink-500 font-bold cursor-pointer font-heading">
            View All Orders ➔
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center font-medium">No recent orders yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 font-heading">
                    #{order.orderId} • {order.customerDetails?.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    +91 {order.customerDetails?.phone} | {order.items?.length} items
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900 font-heading">₹{order.totalAmount}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      order.status === 'Delivered'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
