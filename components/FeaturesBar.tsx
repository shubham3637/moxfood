'use client';

import React from 'react';
import { Truck, ShieldCheck, BadgePercent, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturesBar() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Truck size={26} className="text-pink-600 animate-float" />,
      title: t('featDeliveryTitle'),
      subtitle: t('featDeliverySub'),
      badge: 'SPEEDY',
    },
    {
      icon: <ShieldCheck size={26} className="text-blue-900 animate-pulse" />,
      title: t('featQualityTitle'),
      subtitle: t('featQualitySub'),
      badge: 'VERIFIED',
    },
    {
      icon: <BadgePercent size={26} className="text-pink-600 animate-float" />,
      title: t('featPriceTitle'),
      subtitle: t('featPriceSub'),
      badge: 'DISCOUNTS',
    },
    {
      icon: <CreditCard size={26} className="text-blue-900 animate-pulse" />,
      title: t('featPayTitle'),
      subtitle: t('featPaySub'),
      badge: 'SECURE',
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 my-10">
      {features.map((feat, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex items-start gap-4 group hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-pink-50 transition-all shadow-inner">
            {feat.icon}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm font-heading">{feat.title}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
