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

        {/* 3. Catalog Products Section */}
        <section id="products-grid" className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {searchQuery ? (
                <p className="text-xs text-slate-600 font-medium">
                  Search results for &quot;<strong className="text-pink-600">{searchQuery}</strong>&quot; ({products.length} items found)
                </p>
              ) : (
                <h2 className="text-sm sm:text-base font-black text-slate-800 font-heading">{t('catalogSub')}</h2>
              )}
            </div>

            {/* Filter Tabs: All items, Combo, Newly launched */}
            <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl gap-1.5 text-xs font-extrabold shrink-0 self-start sm:self-auto shadow-inner overflow-x-auto max-w-full">
              <button
                onClick={() => handleTabSelect('all')}
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === 'all' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('filterAll')}
              </button>
              <button
                onClick={() => handleTabSelect('featured')}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentTab === 'featured' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} />
                <span>{t('filterCombo')}</span>
              </button>
              <button
                onClick={() => handleTabSelect('trending')}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentTab === 'trending' ? 'bg-blue-800 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame size={14} />
                <span>{t('filterNew')}</span>
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

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Welcome to <strong>Moxfood</strong>, your ultimate destination to buy 100% pure, raw, and roasted <strong>healthy seeds online</strong> at wholesale prices. We offer a comprehensive selection of nutrient-dense superfoods including <strong>Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds, Watermelon Seeds, Muskmelon Seeds</strong>, and specially curated <strong>7-in-1 Super Seeds Mixes</strong>. Whether you are looking for diet seeds for weight management, energy-boosting daily snacks, or premium dry fruits and nuts, Moxfood brings fresh quality straight from local store to your doorstep.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-bold text-slate-700">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-pink-600 font-heading block">🎃 Pumpkin Seeds</span>
              <span className="text-[11px] text-slate-500 font-medium">Raw & Roasted AAA Grade</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-pink-600 font-heading block">🌱 Organic Chia Seeds</span>
              <span className="text-[11px] text-slate-500 font-medium">Rich in Omega-3 & Fibre</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-pink-600 font-heading block">🌻 Sunflower Seeds</span>
              <span className="text-[11px] text-slate-500 font-medium">Pure Vitamin E Superfood</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-pink-600 font-heading block">🥜 Seed Mixes & Nuts</span>
              <span className="text-[11px] text-slate-500 font-medium">Roasted Salted & Raw Packs</span>
            </div>
          </div>
        </section>

        {/* 6. Full-Width Customer Testimonials & Stats Counter Section */}
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
