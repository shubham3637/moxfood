'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-blue-900/90 p-0.5 sm:p-1 rounded-full border border-blue-700/80 text-[10px] sm:text-xs font-extrabold shadow-inner shrink-0">
      <div className="flex items-center gap-1 pl-1.5 sm:pl-2.5 pr-0.5 text-pink-300">
        <Languages size={12} className="sm:w-3.5 sm:h-3.5" />
      </div>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-pink-600 text-white shadow-md font-black'
            : 'text-blue-200 hover:text-white font-bold'
        }`}
      >
        <span className="sm:hidden">EN</span>
        <span className="hidden sm:inline">ENGLISH</span>
      </button>
      <button
        onClick={() => setLanguage('gu')}
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all cursor-pointer ${
          language === 'gu'
            ? 'bg-pink-600 text-white shadow-md font-black'
            : 'text-blue-200 hover:text-white font-bold'
        }`}
      >
        <span>ગુજરાતી</span>
      </button>
    </div>
  );
}
