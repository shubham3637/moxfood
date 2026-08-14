'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import DealsTicker from '@/components/DealsTicker';
import HeroSlider from '@/components/HeroSlider';
import FeaturesBar from '@/components/FeaturesBar';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import { Search, RefreshCw, Globe, Leaf, ArrowRight, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const getCategoryEmoji = (slug: string) => {
  const s = (slug || '').toLowerCase();
  if (s.includes('seed')) return '🌱';
  if (s.includes('fruit') || s.includes('nut')) return '🌰';
  if (s.includes('atta') || s.includes('rice') || s.includes('grain')) return '🌾';
  if (s.includes('oil') || s.includes('masala') || s.includes('spice')) return '🛢️';
  if (s.includes('snack') || s.includes('namkeen')) return '🍿';
  if (s.includes('tea') || s.includes('beverage') || s.includes('coffee')) return '☕';
  if (s.includes('dairy') || s.includes('bakery')) return '🥛';
  return '📦';
};

function StorefrontContent() {
  const { t, language, setLanguage } = useLanguage();
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, [searchQuery, currentTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      let url = `/api/products?category=${currentTab}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const [prodRes, catRes] = await Promise.all([
        fetch(url),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
    } catch (error) {
      console.error('Failed to load store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSelect = (tab: string) => {
    setCurrentTab(tab);
    scrollToProducts();
  };

  const clearFilters = () => {
    setCurrentTab('all');
    setSearchQuery('');
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Group products category-wise when on 'all' tab without search filter
  const isCategorizedView = currentTab === 'all' && !searchQuery;

  const categoryGroups = useMemo(() => {
    if (!isCategorizedView) return [];

    const map = new Map<string, { category: any; products: any[] }>();

    // Initialize with categories from database
    categories.forEach((cat) => {
      map.set(cat.slug, { category: cat, products: [] });
    });

    const unmapped: any[] = [];

    products.forEach((prod) => {
      const catKey = prod.category;
      let target = map.get(catKey);

      if (!target) {
        const foundCat = categories.find(
          (c) => c.slug === catKey || c.name.toLowerCase() === catKey.toLowerCase()
        );
        if (foundCat) {
          target = map.get(foundCat.slug);
        }
      }

      if (target) {
        target.products.push(prod);
      } else {
        unmapped.push(prod);
      }
    });

    const result = Array.from(map.values()).filter((group) => group.products.length > 0);

    if (unmapped.length > 0) {
      result.push({
        category: {
          name: 'Other Essentials',
          altNameGujarati: 'અન્ય જરૂરી સામાન',
          slug: 'other',
        },
        products: unmapped,
      });
    }

    return result;
  }, [categories, products, isCategorizedView]);

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

        {/* 3. Main Products Grid Section with Category-wise Sections */}
        <section id="products-grid" className="space-y-6 pt-2">
          {/* Header & Category Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                {t('catalogTitle')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">{t('catalogSub')}</p>
            </div>

            {/* Dynamic Category Filter Pills */}
            <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl gap-1.5 text-xs font-extrabold shrink-0 self-start sm:self-auto shadow-inner overflow-x-auto max-w-full font-heading">
              <button
                onClick={() => handleTabSelect('all')}
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === 'all' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('filterAll')}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleTabSelect(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    currentTab === cat.slug ? 'bg-pink-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>
                    {language === 'gu' && cat.altNameGujarati ? cat.altNameGujarati : cat.name}
                  </span>
                </button>
              ))}
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
                className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer font-heading"
              >
                {t('resetFilters')}
              </button>
            </div>
          ) : isCategorizedView ? (
            /* Category-Wise Dedicated Sections View */
            <div className="space-y-10 animate-fade-in">
              {categoryGroups.map((group) => {
                const catName =
                  language === 'gu' && group.category.altNameGujarati
                    ? group.category.altNameGujarati
                    : group.category.name;

                return (
                  <div
                    key={group.category.slug || group.category.name}
                    className="space-y-4 pt-6 border-t border-slate-200/80 first:border-t-0 first:pt-0"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center font-bold text-xl shadow-sm">
                          {getCategoryEmoji(group.category.slug)}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading flex items-center gap-2.5">
                            <span>{catName}</span>
                            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-0.5 rounded-full border border-pink-100 font-mono">
                              {group.products.length} {t('items')}
                            </span>
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTabSelect(group.category.slug)}
                        className="text-xs font-extrabold text-pink-600 hover:text-pink-700 flex items-center gap-1 font-heading cursor-pointer bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-100 transition-colors"
                      >
                        <span>{language === 'gu' ? 'બધું જુઓ' : 'View Section'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    {/* Section Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6">
                      {group.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Single Category / Filtered Products Grid */
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
