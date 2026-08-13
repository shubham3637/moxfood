'use client';

import React, { useEffect, useState, Suspense } from 'react';
import DealsTicker from '@/components/DealsTicker';
import HeroSlider from '@/components/HeroSlider';
import FeaturesBar from '@/components/FeaturesBar';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import { Search, Sparkles, RefreshCw, Flame, Globe, Leaf } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function StorefrontContent() {
  const { t, language, setLanguage } = useLanguage();
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, [searchQuery, currentTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      let url = `/api/products?category=${currentTab}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const prodRes = await fetch(url);
      const prodData = await prodRes.json();
      const activeProducts = prodData.products || [];

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
    setCurrentTab('all');
    setSearchQuery('');
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Primary Semantic H1 for SEO */}
      <h1 className="sr-only">
        Moxfood - Buy Premium Healthy Seeds, Pumpkin Seeds, Chia Seeds, Sunflower Seeds & Dry Fruits Online
      </h1>

      {/* 0. Live Offers Marquee Ticker */}
      <DealsTicker />

      {/* Main Full Width Content Wrapper */}
      <div className="w-full px-4 md:px-10 lg:px-16 py-6 space-y-8">
        {/* 1. Full-Width Dynamic Hero Image Slider */}
        <HeroSlider onExploreClick={scrollToProducts} />

        {/* 2. Language Selection Switcher Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-4 sm:p-5 rounded-3xl border border-blue-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-pink-600/30 text-pink-300 border border-pink-500/40 flex items-center justify-center shrink-0">
              <Globe size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-heading">
                {language === 'gu' ? 'સ્ટોર ભાષા પસંદ કરો (Select Language)' : 'Select Store Language'}
              </h3>
              <p className="text-[11px] sm:text-xs text-blue-200 font-medium">
                {language === 'gu' ? 'ગુજરાતી અને ઈંગ્લીશ બંને માં સામાન જોઈ શકાશે' : 'Switch store language between English & Gujarati'}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-blue-950 p-1.5 rounded-2xl border border-blue-800 text-xs font-black shadow-inner gap-2 shrink-0">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'en'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30'
                  : 'text-blue-200 hover:text-white hover:bg-blue-900'
              }`}
            >
              <span>🇬🇧 ENGLISH</span>
            </button>
            <button
              onClick={() => setLanguage('gu')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'gu'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30'
                  : 'text-blue-200 hover:text-white hover:bg-blue-900'
              }`}
            >
              <span>🇮🇳 ગુજરાતી</span>
            </button>
          </div>
        </div>

        {/* 3. Main Products Grid Section */}
        <section id="products-grid" className="space-y-6 pt-2">
          {/* Header & 3 Main Category Filter Pills Tabs: All Items, Dry Fruits, Seeds */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                {t('catalogTitle')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">{t('catalogSub')}</p>
            </div>

            {/* 3 Main Category Filter Tabs: All Items | Dry Fruits | Seeds */}
            <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl gap-1.5 text-xs font-extrabold shrink-0 self-start sm:self-auto shadow-inner overflow-x-auto max-w-full font-heading">
              <button
                onClick={() => handleTabSelect('all')}
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === 'all' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('filterAll')}
              </button>

              <button
                onClick={() => handleTabSelect('dry-fruits')}
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === 'dry-fruits' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t('filterDryFruits')}</span>
              </button>

              <button
                onClick={() => handleTabSelect('seeds-superfoods')}
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === 'seeds-superfoods' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t('filterSeeds')}</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20 space-y-3">
              <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Loading grocery products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto my-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto font-bold text-xl">
                <Search size={28} />
              </div>
              <h3 className="font-black text-slate-800 text-lg font-heading">{t('noProductsFound')}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {t('noProductsSub')}
              </p>
              <button
                onClick={clearFilters}
                className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                {t('resetFilters')}
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

        {/* 4. Full-Width Features Highlight Bar */}
        <FeaturesBar />

        {/* 5. Rich SEO Keyword Section for Healthy Seeds & Superfoods */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-pink-600">
            <Leaf size={22} />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Moxfood - Premium Healthy Seeds, Superfoods & Nutrient-Rich Grocery
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Welcome to <strong>Moxfood</strong>, India&apos;s leading online superstore for raw and roasted healthy seeds, organic superfoods, and premium daily grocery ration. We specialize in offering 100% pure, unadulterated <strong>Raw Pumpkin Seeds (કદૂ ના બી)</strong>, <strong>Organic Chia Seeds (ચિયા સીડ્સ)</strong>, <strong>Sunflower Seeds (સૂર્યમુખી ના બી)</strong>, <strong>Flax Seeds (અળસી)</strong>, <strong>Sabja Seeds</strong>, and <strong>7-in-1 Super Seed Mixes</strong> at unbeatable wholesale direct rates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-slate-700">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              🌱 100% Pure Raw & Roasted Seeds
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              ⚡ Fast Doorstep Express Shipping
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              💎 Up to 25% Off Wholesale Savings
            </div>
          </div>
        </section>

        {/* 6. Customer Testimonials & Reviews */}
        <Testimonials />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading store...</div>}>
      <StorefrontContent />
    </Suspense>
  );
}
