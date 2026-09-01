'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const whatsappNumber = '917096396856';
  const defaultMsg =
    language === 'gu'
      ? 'નમસ્તે મોક્સફૂડ, મને ઓર્ડર અને પ્રોડક્ટ બાબતે વધુ માહિતી જોઈએ છે.'
      : 'Hello Moxfood, I have an inquiry regarding healthy seeds and products.';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer font-heading"
      aria-label="Contact Us on WhatsApp"
    >
      <span className="relative flex h-3 w-3 shrink-0 sm:hidden">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>

      <div className="flex items-center gap-2">
        <MessageCircle size={24} className="fill-white text-emerald-600 shrink-0" />
        <span className="hidden sm:inline font-extrabold text-xs tracking-wide">
          {language === 'gu' ? 'વોટ્સએપ પર સંપર્ક કરો' : 'WhatsApp Support'}
        </span>
      </div>
    </a>
  );
}
