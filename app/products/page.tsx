'use client';

import React, { useEffect, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { RefreshCw, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function ProductsPageContent() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch('/api/products?category=all');
      const prodData = await prodRes.json();
      setProducts(prodData.products || []);
    } catch (error) {
      console.error('Failed to load products page:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8 space-y-6">
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
          <h3 className="font-black text-slate-800 text-lg font-heading">{t('noProductsFound')}</h3>
          <p className="text-xs text-slate-500 font-medium">No items available in store catalog.</p>
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
    <Suspense
      fallback={
        <div className="text-center py-24">
          <RefreshCw size={36} className="animate-spin text-pink-600 mx-auto" />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
