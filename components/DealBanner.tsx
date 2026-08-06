'use client';

import React from 'react';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DealBannerProps {
  onShopDealsClick?: () => void;
}

export default function DealBanner({ onShopDealsClick }: DealBannerProps) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-blue-950 text-white p-6 md:p-8 shadow-xl mb-10 border border-pink-500/40">
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
        <Sparkles size={260} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black text-white border border-white/30">
            <Tag size={12} />
            <span>{t('dealTag')}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight font-heading">
            {t('dealTitle')}
          </h3>
          <p className="text-pink-100 text-xs md:text-sm font-medium max-w-xl">
            {t('dealSub')}
          </p>
        </div>

        <button
          onClick={onShopDealsClick}
          className="bg-white text-pink-600 hover:bg-blue-950 hover:text-white px-6 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shrink-0 cursor-pointer font-heading"
        >
          <span>{t('dealButton')}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
