'use client';

import React from 'react';
import { Wheat, Flame, Milk, Cookie, Coffee, Sparkles, ShoppingBag } from 'lucide-react';

interface CategoryCardProps {
  category: {
    name: string;
    altNameGujarati?: string;
    slug: string;
    image?: string;
    iconName?: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Wheat: <Wheat size={22} />,
  Flame: <Flame size={22} />,
  Milk: <Milk size={22} />,
  Cookie: <Cookie size={22} />,
  Coffee: <Coffee size={22} />,
  Sparkles: <Sparkles size={22} />,
};

export default function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  const IconComponent = category.iconName ? iconMap[category.iconName] || <ShoppingBag size={22} /> : <ShoppingBag size={22} />;

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-300 text-center cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-br from-blue-900 to-indigo-950 border-pink-500 text-white shadow-xl ring-4 ring-pink-500/30 scale-105 z-10'
          : 'bg-white border-slate-200/90 text-slate-700 hover:border-pink-400 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2.5 transition-all group-hover:scale-110 shadow-inner ${
          isSelected ? 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white font-bold shadow-lg shadow-pink-600/40' : 'bg-blue-50 text-blue-900 group-hover:bg-pink-50 group-hover:text-pink-600'
        }`}
      >
        {IconComponent}
      </div>

      <div className="font-extrabold text-xs line-clamp-2 leading-tight font-heading">{category.name}</div>
    </button>
  );
}
