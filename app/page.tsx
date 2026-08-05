'use client';

import React, { useEffect, useState, Suspense } from 'react';
import DealsTicker from '@/components/DealsTicker';
import HeroSlider from '@/components/HeroSlider';
import FeaturesBar from '@/components/FeaturesBar';
import DealBanner from '@/components/DealBanner';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import { Search, Sparkles, RefreshCw, ShoppingBag, Flame } from 'lucide-react';

function StorefrontContent() {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [currentCategory, searchQuery, currentTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      let url = `/api/products?category=${currentCategory}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (currentTab === 'featured') url += `&featured=true`;
      if (currentTab === 'trending') url += `&trending=true`;

      const prodRes = await fetch(url);
      const prodData = await prodRes.json();
      let activeProducts = prodData.products || [];

      if (activeProducts.length === 0) {
        setSeeding(true);
        const seedRes = await fetch('/api/seed', { method: 'POST' });
        const seedData = await seedRes.json();

        if (seedData.success) {
          const pRes = await fetch(url);
          const pD = await pRes.json();
          activeProducts = pD.products || [];
        }
        setSeeding(false);
      }

      setProducts(activeProducts);
    } catch (error) {
      console.error('Failed to load store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSelect = (tab: string) => {
    setCurrentTab(tab);
  };

  const clearFilters = () => {
    setCurrentCategory('all');
    setCurrentTab('all');
    setSearchQuery('');
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 0. Live Offers Marquee Ticker */}
      <DealsTicker />

      {/* Main Full Width Content Wrapper */}
      <div className="w-full px-4 md:px-10 lg:px-16 py-6 space-y-10">
        {/* 1. Full-Width Dynamic Hero Image Slider */}
        <HeroSlider onExploreClick={scrollToProducts} />

        {/* 2. Fresh Grocery Catalog Section - DIRECTLY BELOW Hero Slider */}
        <section id="products-grid" className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-heading">
                <ShoppingBag size={26} className="text-blue-900" />
                <span>Fresh Grocery Catalog</span>
              </h2>
              {searchQuery ? (
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Search results for &quot;<strong className="text-pink-600">{searchQuery}</strong>&quot; ({products.length} items found)
                </p>
              ) : (
                <p className="text-xs text-slate-500 font-medium font-semibold">Fresh & pure grocery items for daily home use</p>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl gap-1.5 text-xs font-extrabold shrink-0 self-start sm:self-auto shadow-inner">
              <button
                onClick={() => handleTabSelect('all')}
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'all' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => handleTabSelect('featured')}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'featured' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} />
                <span>Featured Deals</span>
              </button>
              <button
                onClick={() => handleTabSelect('trending')}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'trending' ? 'bg-blue-800 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame size={14} />
                <span>Popular</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading || seeding ? (
            <div className="text-center py-20 space-y-3">
              <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                {seeding ? 'Seeding store grocery items...' : 'Loading grocery products...'}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto my-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto font-bold text-xl">
                <Search size={28} />
              </div>
              <h3 className="font-black text-slate-800 text-lg font-heading">No Products Found</h3>
              <p className="text-xs text-slate-500 font-medium">
                No items available for your search or category filter.
              </p>
              <button
                onClick={clearFilters}
                className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Responsive Full-Width Products Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6 animate-fade-in">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 3. Full-Width Features Highlight Bar */}
        <FeaturesBar />

        {/* 4. Deal of the Day Promotional Banner */}
        <DealBanner onShopDealsClick={() => handleTabSelect('featured')} />

        {/* 5. Full-Width Customer Testimonials & Stats Counter Section */}
        <Testimonials />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="text-center py-24">
        <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
      </div>
    }>
      <StorefrontContent />
    </Suspense>
  );
}
