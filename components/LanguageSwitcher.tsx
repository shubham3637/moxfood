'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-blue-900/80 p-1 rounded-full border border-blue-700/80 text-xs font-extrabold shadow-inner shrink-0">
      <div className="flex items-center gap-1 pl-2.5 pr-1 text-pink-300">
        <Languages size={14} />
      </div>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-pink-600 text-white shadow-md'
            : 'text-blue-200 hover:text-white'
        }`}
      >
        ENGLISH
      </button>
      <button
        onClick={() => setLanguage('gu')}
        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
          language === 'gu'
            ? 'bg-pink-600 text-white shadow-md'
            : 'text-blue-200 hover:text-white'
        }`}
      >
        ગુજરાતી
      </button>
    </div>
  );
}
