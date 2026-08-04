'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { Search, Sparkles, RefreshCw, ShoppingBag, LayoutGrid, Flame, Filter, SlidersHorizontal } from 'lucide-react';

function ProductsPageContent() {
  const searchParams = useSearchParams();

  // Initialize from searchParams if present, but manage via state
  const [currentCategory, setCurrentCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentTab, setCurrentTab] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsData();
  }, [currentCategory, searchQuery, currentTab, sortBy]);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      setCategories(catData.categories || []);

      let url = `/api/products?category=${currentCategory}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (currentTab === 'featured') url += `&featured=true`;
      if (currentTab === 'trending') url += `&trending=true`;

      const prodRes = await fetch(url);
      const prodData = await prodRes.json();
      let activeProducts = prodData.products || [];

      // Sort client side
      if (sortBy === 'price-low') {
        activeProducts.sort((a: any, b: any) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        activeProducts.sort((a: any, b: any) => b.price - a.price);
      } else if (sortBy === 'discount') {
        activeProducts.sort((a: any, b: any) => (b.mrp - b.price) - (a.mrp - a.price));
      }

      setProducts(activeProducts);
    } catch (error) {
      console.error('Failed to load products page:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCurrentCategory('all');
    setSearchQuery('');
    setCurrentTab('all');
    setSortBy('featured');
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl border border-blue-800 space-y-3 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-600/40 text-pink-200 text-xs font-extrabold border border-pink-500/50">
            <ShoppingBag size={14} className="text-pink-400" />
            <span>STORE CATALOG • All Items</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight">
            Browse All Grocery Products
          </h1>
          <p className="text-blue-200 text-xs md:text-sm font-medium max-w-2xl">
            Order fresh Whole Wheat Atta, Edible Oil, Toor Dal, Tea, Spices, Dairy & Snacks at wholesale rates.
          </p>
        </div>
      </div>

      {/* Filter Control Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-2xl pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Tab Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
            <button
              onClick={() => setCurrentTab('all')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'all' ? 'bg-blue-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setCurrentTab('featured')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'featured' ? 'bg-pink-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles size={14} />
              <span>Special Deals</span>
            </button>
            <button
              onClick={() => setCurrentTab('trending')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'trending' ? 'bg-blue-800 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Flame size={14} />
              <span>Popular</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 text-slate-900 text-xs font-extrabold rounded-2xl px-3.5 py-2.5 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort by Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-extrabold text-slate-400 shrink-0 uppercase tracking-wider text-[10px]">Category:</span>
          <button
            onClick={() => setCurrentCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              currentCategory === 'all' ? 'bg-pink-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCurrentCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                currentCategory === cat.slug ? 'bg-pink-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid Section */}
      {loading ? (
        <div className="text-center py-24 space-y-3">
          <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Loading catalog items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto font-bold text-xl">
            <Search size={28} />
          </div>
          <h3 className="font-black text-slate-800 text-lg font-heading">No Products Found</h3>
          <p className="text-xs text-slate-500 font-medium">
            No items matched your current filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6 animate-fade-in">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-24"><RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" /></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
