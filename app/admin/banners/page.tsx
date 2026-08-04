'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Upload, RefreshCw, X, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '/?category=atta-rice',
    buttonText: 'Shop Deals Now',
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          setFormData((prev) => ({ ...prev, image: data.url }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload banner image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      alert('Banner Title and Image are required.');
      return;
    }

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ title: '', subtitle: '', image: '', link: '/?category=atta-rice', buttonText: 'Shop Deals Now' });
        fetchBanners();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete banner "${title}"?`)) {
      try {
        const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchBanners();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (err: any) {
        alert('Failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hero Slider Banner Management
          </h1>
          <p className="text-xs text-slate-500">
            Upload and manage custom promotional carousel banners for the home page slider
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          <span>Upload New Banner</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <RefreshCw size={32} className="animate-spin text-pink-600 mx-auto" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3 max-w-md mx-auto">
          <ImageIcon size={36} className="text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">No Custom Banners Yet</h3>
          <p className="text-xs text-slate-500">Upload your first Hero Carousel banner image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <h4 className="font-extrabold text-sm line-clamp-1">{b.title}</h4>
                  {b.subtitle && <p className="text-[11px] text-slate-200 line-clamp-1">{b.subtitle}</p>}
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold flex items-center gap-1">
                    <ExternalLink size={12} /> Target Link:
                  </span>
                  <span className="font-mono text-pink-600 truncate max-w-[140px]">{b.link || '/'}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                    Button: {b.buttonText || 'Shop Now'}
                  </span>
                  <button
                    onClick={() => handleDelete(b._id, b.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Upload New Hero Banner Image
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
                <label className="block font-bold text-slate-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Festival Discount Offer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle / Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Save ₹100 on Atta & Oil Combos this week!"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              {/* Image Upload Widget */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Banner Image * (Upload File to Cloudinary or Paste Image URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Image URL or upload file below..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  <label className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-1 shrink-0 text-xs">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden cursor-pointer"
                    />
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-2.5 relative h-28 rounded-xl overflow-hidden border border-slate-200">
                    <img src={formData.image} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Click Link</label>
                  <input
                    type="text"
                    placeholder="/?category=atta-rice"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Button Action Text</label>
                  <input
                    type="text"
                    placeholder="Shop Now"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
              >
                Save & Publish Hero Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
