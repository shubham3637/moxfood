
'use client';

import React from 'react';
import { Truck, Sparkles, AlertCircle, PhoneCall, ShieldCheck, Tag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DealsTicker() {
  const { language } = useLanguage();

  const tickerItems =
    language === 'gu'
      ? [
          {
            icon: <Truck size={14} className="text-pink-400 shrink-0" />,
            text: 'ડિસ્પેચ અને ડિલિવરી: ડિસ્પેચ સમય 2-3 દિવસ • ડિલિવરી 7-10 દિવસમાં',
          },
          {
            icon: <Sparkles size={14} className="text-pink-400 shrink-0" />,
            text: 'હેલ્ધી સીડ્સ અને સુપરફૂડ્સ: પમ્પકિન સીડ્સ, ચિયા સીડ્સ, સૂર્યમુખી ના બીજ અને ડ્રાય ફ્રૂટ્સ',
          },
          {
            icon: <AlertCircle size={14} className="text-amber-400 shrink-0" />,
            text: 'ઓર્ડર શરત: ઓછામાં ઓછું 1 kg (1000g) વજન હોવું ફરજિયાત છે',
          },
          {
            icon: <PhoneCall size={14} className="text-emerald-400 shrink-0" />,
            text: '5 kg થી વધુ ઓર્ડર: જથ્થાબંધ ખરીદી માટે વોટ્સએપ પર સંપર્ક કરો (+91 7096396856)',
          },
          {
            icon: <ShieldCheck size={14} className="text-pink-400 shrink-0" />,
            text: '100% શુદ્ધતાની ગેરંટી: તાજો અને પ્રીમિયમ ક્વોલિટી સામાન',
          },
          {
            icon: <Tag size={14} className="text-pink-400 shrink-0" />,
            text: 'રિટર્ન નીતિ: ફૂડ આઇટમ્સ માં કોઇ રિટર્ન નથી • બોક્સ ખોલતા પહેલાં વીડિયો બનાવવો ફરજિયાત છે',
          },
        ]
      : [
          {
            icon: <Truck size={14} className="text-pink-400 shrink-0" />,
            text: 'DISPATCH & DELIVERY: Dispatch in 2-3 Days • Delivery within 7-10 Days',
          },
          {
            icon: <Sparkles size={14} className="text-pink-400 shrink-0" />,
            text: 'HEALTHY SUPERFOODS: Raw & Roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds & Dry Fruits',
          },
          {
            icon: <AlertCircle size={14} className="text-amber-400 shrink-0" />,
            text: 'ORDER REQUIREMENT: Minimum Order Weight 1 kg (1000g) Required',
          },
          {
            icon: <PhoneCall size={14} className="text-emerald-400 shrink-0" />,
            text: 'BULK ORDERS (> 5 kg): Place Order Directly on WhatsApp (+91 7096396856)',
          },
          {
            icon: <ShieldCheck size={14} className="text-pink-400 shrink-0" />,
            text: '100% PURITY GUARANTEED: Premium Fresh Healthy Seeds & Groceries',
          },
          {
            icon: <Tag size={14} className="text-pink-400 shrink-0" />,
            text: 'RETURN POLICY: Food Items Non-Returnable • Unboxing Video Required for Claims',
          },
        ];

  return (
    <div className="w-full bg-blue-950 text-white text-xs py-2.5 overflow-hidden border-b border-blue-800 shadow-md">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-extrabold text-blue-100">
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-blue-900/60 px-4 py-1 rounded-full border border-blue-800 shrink-0"
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
