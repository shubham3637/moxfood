'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('gautamLanguage') as Language;
    if (savedLang === 'en' || savedLang === 'gu') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gautamLanguage', lang);
  };

  const t = (key: keyof typeof translations['en'], vars?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations['en'];
    let text = langDict[key] || translations['en'][key] || String(key);

    if (vars) {
      Object.keys(vars).forEach((varKey) => {
        text = text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(vars[varKey]));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
