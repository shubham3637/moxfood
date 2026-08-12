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
  Scale,
  Image as ImageIcon,
  Images,
} from 'lucide-react';
import { compressImageFile } from '@/lib/imageUtils';
import { useToast } from '@/context/ToastContext';

interface ProductVariant {
  unit: string;
  price: string | number;
  mrp: string | number;
  stock: string | number;
}

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
  const [manualUrlInput, setManualUrlInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    altNameGujarati: '',
    category: 'seeds-superfoods',
    price: '',
    mrp: '',
    stock: '',
    unit: '',
    images: [] as string[],
    description: '',
    isFeatured: false,
    isTrending: false,
    variants: [
      { unit: '', price: '', mrp: '', stock: '' },
    ] as ProductVariant[],
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
    setManualUrlInput('');
    setFormData({
      name: '',
      altNameGujarati: '',
      category: categories.length > 0 ? categories[0].slug : 'seeds-superfoods',
      price: '',
      mrp: '',
      stock: '',
      unit: '',
      images: [],
      description: '',
      isFeatured: false,
      isTrending: false,
      variants: [
        { unit: '', price: '', mrp: '', stock: '' },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingId(product._id);
    setManualUrlInput('');

    const existingVariants: ProductVariant[] =
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants.map((v: any) => ({
            unit: v.unit || '',
            price: String(v.price ?? ''),
            mrp: String(v.mrp ?? ''),
            stock: String(v.stock ?? ''),
          }))
        : [
            {
              unit: product.unit || '',
              price: String(product.price ?? ''),
              mrp: String(product.mrp ?? ''),
              stock: String(product.stock ?? ''),
            },
          ];

    const existingImages: string[] =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [];

    setFormData({
      name: product.name || '',
      altNameGujarati: product.altNameGujarati || '',
      category: product.category || (categories.length > 0 ? categories[0].slug : 'seeds-superfoods'),
      price: String(product.price ?? ''),
      mrp: String(product.mrp ?? ''),
      stock: String(product.stock ?? ''),
      unit: product.unit || '',
      images: existingImages,
      description: product.description || '',
      isFeatured: Boolean(product.isFeatured),
      isTrending: Boolean(product.isTrending),
      variants: existingVariants,
    });
    setIsModalOpen(true);
  };

  const handleAddVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { unit: '', price: '', mrp: '', stock: '' }],
    }));
  };

  const handleRemoveVariantRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  // Upload Multiple Images simultaneously
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 1. Client-side compression
        const compressedBase64 = await compressImageFile(file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: compressedBase64 }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            uploadedUrls.push(data.url);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
        showSuccess(`${uploadedUrls.length} photo(s) uploaded successfully!`);
      } else {
        showError('Failed to upload selected photos.');
      }
    } catch (err: any) {
      console.error('Failed to upload image gallery:', err);
      showError(err.message || 'Failed to upload photos.');
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, manualUrlInput.trim()],
    }));
    setManualUrlInput('');
    showSuccess('Photo URL added!');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showError('Product name is required.');
      return;
    }

    // Process valid variants
    const validVariants = formData.variants
      .filter((v) => v.unit && v.price && v.mrp)
      .map((v) => ({
        unit: String(v.unit).trim(),
        price: Number(v.price),
        mrp: Number(v.mrp),
        stock: Number(v.stock || 0),
      }));

    const primaryUnit = validVariants.length > 0 ? validVariants[0].unit : (formData.unit.trim() || '1 Pack');
    const primaryPrice = validVariants.length > 0 ? validVariants[0].price : Number(formData.price || 0);
    const primaryMrp = validVariants.length > 0 ? validVariants[0].mrp : Number(formData.mrp || 0);
    const primaryStock = validVariants.length > 0 ? validVariants[0].stock : Number(formData.stock || 0);

    const payload = {
      name: formData.name.trim(),
      altNameGujarati: '',
      category: formData.category,
      price: primaryPrice,
      mrp: primaryMrp,
      stock: primaryStock,
      unit: primaryUnit,
      variants: validVariants,
      images: formData.images,
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
          <p className="text-xs text-slate-500 font-medium">Manage Moxfood healthy seeds, multiple weight variants & photos gallery</p>
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
                  <th className="py-3.5 px-4">Photos</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Available Weight Variants</th>
                  <th className="py-3.5 px-4">Base Price / MRP</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => {
                  const imgList = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [];
                  const mainImg = imgList.length > 0 ? imgList[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80';

                  return (
                    <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative inline-block">
                          <img
                            src={mainImg}
                            alt={prod.name}
                            className="w-11 h-11 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200"
                          />
                          {imgList.length > 1 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow border border-white font-mono">
                              +{imgList.length - 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 font-heading">{prod.name}</div>
                        {imgList.length > 1 && (
                          <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                            <Images size={11} className="text-pink-600" />
                            <span>{imgList.length} photos gallery</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{prod.category}</td>
                      
                      {/* Weight Variants list badge */}
                      <td className="py-3 px-4">
                        {Array.isArray(prod.variants) && prod.variants.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {prod.variants.map((v: any, i: number) => (
                              <span
                                key={i}
                                className="bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono"
                              >
                                {v.unit}: ₹{v.price}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {prod.unit}
                          </span>
                        )}
                      </td>

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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                {editingId ? 'Edit Product, Photos & Weight Variants' : 'Add New Product with Multiple Photos & Weight Variants'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              {/* Multiple Photos Upload Gallery Manager */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 font-heading">
                    <Images size={18} className="text-pink-600" />
                    <span>Product Photo Gallery (એક કરતા વધુ ફોટો અપલોડ કરો)</span>
                  </label>

                  <label className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[11px] px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-colors font-heading self-start sm:self-auto">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : '+ Upload Multiple Photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImagesUpload}
                      className="hidden cursor-pointer"
                    />
                  </label>
                </div>

                {/* Manual URL Add Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Or paste image URL here and click Add..."
                    value={manualUrlInput}
                    onChange={(e) => setManualUrlInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-colors shrink-0"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Uploaded Thumbnails Grid */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 pt-1">
                    {formData.images.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group bg-white p-1 rounded-xl border border-slate-200 shadow-sm aspect-square flex items-center justify-center"
                      >
                        <img
                          src={url}
                          alt={`Product photo ${idx + 1}`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X size={12} />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-pink-600 text-white text-[9px] font-black px-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    No photos uploaded yet. Select multiple photos to build product gallery.
                  </div>
                )}
              </div>

              {/* Weight Variants Manager Section */}
              <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-900 font-extrabold font-heading">
                    <Scale size={18} />
                    <span>Manage Weight Variants & Prices (વજન અને ભાવ)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Weight Variant</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center shadow-sm"
                    >
                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block font-bold mb-0.5">Weight / Unit</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 250 g, 500 g, 1 kg"
                          value={v.unit}
                          onChange={(e) => handleVariantChange(idx, 'unit', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:ring-2 focus:ring-pink-500"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block font-bold mb-0.5">Selling Price (₹)</label>
                        <input
                          type="number"
                          required
                          placeholder="Price"
                          value={v.price}
                          onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-pink-500 font-extrabold"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block font-bold mb-0.5">MRP (₹)</label>
                        <input
                          type="number"
                          required
                          placeholder="MRP"
                          value={v.mrp}
                          onChange={(e) => handleVariantChange(idx, 'mrp', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-pink-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-500 block font-bold mb-0.5">Stock</label>
                        <input
                          type="number"
                          required
                          placeholder="Stock"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-pink-500"
                        />
                      </div>

                      <div className="col-span-1 text-right pt-3">
                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove weight option"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
