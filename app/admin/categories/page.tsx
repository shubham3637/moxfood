'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  FolderTree,
  Edit2,
  Trash2,
  X,
  Upload,
  RefreshCw,
  Leaf,
  Wheat,
  Flame,
  Milk,
  Cookie,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { compressImageFile } from '@/lib/imageUtils';
import { useToast } from '@/context/ToastContext';

export default function AdminCategoriesPage() {
  const { showError, showSuccess } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    altNameGujarati: '',
    slug: '',
    image: '',
    iconName: 'Leaf',
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
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      showError('Failed to load category list.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      altNameGujarati: '',
      slug: '',
      image: '',
      iconName: 'Leaf',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: any) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name || '',
      altNameGujarati: cat.altNameGujarati || '',
      slug: cat.slug || '',
      image: cat.image || '',
      iconName: cat.iconName || 'Leaf',
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    setFormData({
      ...formData,
      name: val,
      slug: editingId ? formData.slug : autoSlug,
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedBase64 = await compressImageFile(file, 800, 800, 0.8);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedBase64 }),
      });

      if (!res.ok) {
        throw new Error('Image upload failed');
      }

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        showSuccess('Category image uploaded!');
      } else {
        throw new Error(data.error || 'Failed to process category image.');
      }
    } catch (err: any) {
      showError('Upload error: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      showError('Category Name and URL Slug are required.');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (data.success) {
        showSuccess(editingId ? 'Category updated successfully!' : 'New Category added!');
        setIsModalOpen(false);
        fetchCategories();
      } else {
        showError(data.error || 'Failed to save category.');
      }
    } catch (err: any) {
      showError('Network Error: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          showSuccess(`Category "${name}" deleted.`);
          fetchCategories();
        } else {
          showError(data.error || 'Failed to delete category.');
        }
      } catch (err: any) {
        showError('Error deleting category: ' + err.message);
      }
    }
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf size={22} className="text-pink-600" />;
      case 'Wheat':
        return <Wheat size={22} className="text-amber-600" />;
      case 'Flame':
        return <Flame size={22} className="text-rose-600" />;
      case 'Milk':
        return <Milk size={22} className="text-blue-600" />;
      case 'Cookie':
        return <Cookie size={22} className="text-orange-600" />;
      case 'Coffee':
        return <Coffee size={22} className="text-amber-800" />;
      case 'Sparkles':
        return <Sparkles size={22} className="text-purple-600" />;
      default:
        return <FolderTree size={22} className="text-pink-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage all Moxfood store sections and product categories</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer font-heading"
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
              key={cat._id || cat.slug}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-12 h-12 object-contain rounded-2xl bg-slate-50 p-1 border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center font-bold shrink-0">
                    {renderIcon(cat.iconName)}
                  </div>
                )}

                <div className="min-w-0 space-y-0.5">
                  <div className="font-extrabold text-slate-900 text-sm font-heading truncate">{cat.name}</div>
                  {cat.altNameGujarati && (
                    <div className="text-[11px] text-pink-600 font-bold truncate">{cat.altNameGujarati}</div>
                  )}
                  <div className="text-[10px] text-slate-400 font-mono truncate">slug: {cat.slug}</div>
                </div>
              </div>

              {/* Edit & Delete Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-2 text-slate-500 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="p-2 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                {editingId ? 'Edit Category' : 'Add New Category'}
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
                <label className="block font-bold text-slate-700 mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healthy Seeds & Superfoods"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gujarati Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ડ્રાય સીડ્સ અને હેલ્ધી ખોરાક"
                  value={formData.altNameGujarati}
                  onChange={(e) => setFormData({ ...formData, altNameGujarati: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="seeds-superfoods"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono"
                />
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Category Image (Upload or Image URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or select file..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  <label className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 shrink-0 font-heading">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden cursor-pointer"
                    />
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={formData.image}
                      alt="Category Preview"
                      className="w-10 h-10 object-contain rounded border border-slate-200 bg-slate-50"
                    />
                    <span className="text-[11px] text-emerald-600 font-bold">Image Loaded</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Category Icon</label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
                >
                  <option value="Leaf">🌱 Leaf / Healthy Seeds</option>
                  <option value="Wheat">🌾 Wheat / Grains & Atta</option>
                  <option value="Flame">🔥 Flame / Oils & Spices</option>
                  <option value="Milk">🥛 Milk / Dairy & Bakery</option>
                  <option value="Cookie">🍪 Cookie / Snacks & Namkeen</option>
                  <option value="Coffee">☕ Coffee / Tea & Drinks</option>
                  <option value="Sparkles">✨ Sparkles / Cleaning & Care</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all text-xs cursor-pointer font-heading"
              >
                {editingId ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
