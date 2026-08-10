'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { compressImageFile } from '@/lib/imageUtils';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const { showError, showSuccess } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    altNameGujarati: '',
    category: 'seeds-superfoods',
    price: '',
    mrp: '',
    stock: '50',
    unit: '250 g',
    imageUrl: '',
    description: '',
    isFeatured: false,
    isTrending: false,
  });

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();

      setProducts(pData.products || []);
      setCategories(cData.categories || []);
    } catch (err: any) {
      console.error('Failed to fetch product list:', err);
      showError('Failed to load products list from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      altNameGujarati: '',
      category: categories.length > 0 ? categories[0].slug : 'seeds-superfoods',
      price: '',
      mrp: '',
      stock: '50',
      unit: '250 g',
      imageUrl: '',
      description: '',
      isFeatured: false,
      isTrending: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      altNameGujarati: product.altNameGujarati || '',
      category: product.category,
      price: String(product.price),
      mrp: String(product.mrp),
      stock: String(product.stock),
      unit: product.unit || '250 g',
      imageUrl: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
      description: product.description || '',
      isFeatured: Boolean(product.isFeatured),
      isTrending: Boolean(product.isTrending),
    });
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // 1. Client-side compression to prevent 413 Request Entity Too Large error
      const compressedBase64 = await compressImageFile(file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedBase64 }),
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('Image size too large. Please select a smaller photo.');
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        showSuccess('Product image uploaded successfully!');
      } else {
        throw new Error(data.error || 'Failed to process uploaded image.');
      }
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      showError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.mrp) {
      showError('Product name, selling price, and MRP are required.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      altNameGujarati: '',
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      stock: Number(formData.stock),
      unit: formData.unit.trim(),
      images: formData.imageUrl ? [formData.imageUrl] : [],
      description: formData.description.trim(),
      isFeatured: formData.isFeatured,
      isTrending: formData.isTrending,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        showSuccess(editingId ? 'Product updated successfully!' : 'New product saved successfully!');
        setIsModalOpen(false);
        fetchProductsAndCategories();
      } else {
        showError(data.error || 'Failed to save product.');
      }
    } catch (err: any) {
      showError('Network Error: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          showSuccess(`Product "${name}" deleted.`);
          fetchProductsAndCategories();
        } else {
          showError(data.error || 'Failed to delete product.');
        }
      } catch (err: any) {
        showError('Error deleting product: ' + err.message);
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Products Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage all Moxfood healthy seeds & grocery products</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer font-heading"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-slate-50 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw size={32} className="animate-spin text-pink-600 mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50 font-heading">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Unit</th>
                  <th className="py-3.5 px-4">Price / MRP</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={
                          Array.isArray(prod.images) && prod.images.length > 0
                            ? prod.images[0]
                            : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'
                        }
                        alt={prod.name}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 font-heading">{prod.name}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{prod.category}</td>
                    <td className="py-3 px-4 font-mono">{prod.unit}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 font-heading">
                      ₹{prod.price} <span className="text-[10px] text-slate-400 line-through">₹{prod.mrp}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          prod.stock <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {prod.stock} left
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 text-slate-600 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id, prod.name)}
                        className="p-1.5 text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Moxfood Raw Pumpkin Seeds"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 250 g, 500 g, 1 kg"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="199"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="260"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Image Control */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Image (Auto-Compressed Upload)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or select image file..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  <label className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 shrink-0 font-heading">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Compressing...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden cursor-pointer"
                    />
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-12 h-12 object-contain rounded border border-slate-200 bg-slate-50"
                    />
                    <span className="text-[11px] text-emerald-600 font-bold">Image Compressed & Uploaded</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Product description and details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="text-pink-600 focus:ring-pink-500 rounded cursor-pointer"
                  />
                  <span>Show as Featured Item</span>
                </label>

                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="text-pink-600 focus:ring-pink-500 rounded cursor-pointer"
                  />
                  <span>Show as Popular Item</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all text-xs cursor-pointer font-heading"
              >
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
