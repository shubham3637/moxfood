'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  FolderTree,
  X,
  RefreshCw,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    altNameGujarati: '',
    slug: '',
    iconName: 'Wheat',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    setFormData({ ...formData, name: val, slug: autoSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert('Category name and slug are required.');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, altNameGujarati: '' }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ name: '', altNameGujarati: '', slug: '', iconName: 'Wheat' });
        fetchCategories();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-slate-500">Manage all grocery store sections and product categories</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <RefreshCw size={32} className="animate-spin text-pink-600 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-1">
                <div className="font-extrabold text-slate-900 text-sm">{cat.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">Slug: {cat.slug}</div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                <FolderTree size={22} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Add New Category
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pulses & Spices"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="pulses-spices"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Icon</label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
                >
                  <option value="Wheat">🌾 Wheat / Grains</option>
                  <option value="Flame">🔥 Flame / Spices</option>
                  <option value="Milk">🥛 Milk / Dairy</option>
                  <option value="Cookie">🍪 Cookie / Snacks</option>
                  <option value="Coffee">☕ Coffee / Beverages</option>
                  <option value="Sparkles">✨ Sparkles / House care</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
