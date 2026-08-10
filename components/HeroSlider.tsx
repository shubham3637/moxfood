'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Zap, Sparkles, ShieldCheck, Tag } from 'lucide-react';

interface BannerItem {
  _id?: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
}

interface HeroSliderProps {
  onExploreClick?: () => void;
}

const defaultFallbackBanners: BannerItem[] = [
  {
    title: 'Moxfood Premium Healthy Seeds & Superfoods',
    subtitle: 'Buy 100% Raw & Roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds & Seed Mixes!',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
    link: '/products?category=seeds-superfoods',
    buttonText: 'Shop Healthy Seeds',
  },
  {
    title: 'Fresh & Pure Cooking Oils',
    subtitle: 'Fortune, Emami & Pure Groundnut Oil at Wholesale Rates',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80',
    link: '/products?category=oil-masala',
    buttonText: 'Explore Oils & Spices',
  },
  {
    title: 'Premium Tea & Daily Breakfast',
    subtitle: 'Wagh Bakri, Taj Mahal Tea & Amul Fresh Dairy Products',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80',
    link: '/products?category=beverages',
    buttonText: 'Buy Tea & Snacks',
  },
];

export default function HeroSlider({ onExploreClick }: HeroSliderProps) {
  const [banners, setBanners] = useState<BannerItem[]>(defaultFallbackBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (data.success && Array.isArray(data.banners) && data.banners.length > 0) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error('Failed to fetch hero slider banners:', err);
    }
  };

  // Auto-play interval every 3.5 seconds
  useEffect(() => {
    if (!isHovered && banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [isHovered, banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentBanner = banners[currentIndex] || defaultFallbackBanners[0];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-blue-950 text-white shadow-2xl border border-blue-800/80 group my-2 sm:my-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated Glowing Light Orbs */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow z-20" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none z-20" />

      {/* Full-Width Background Carousel Image */}
      <div className="relative h-[360px] sm:h-[460px] md:h-[520px] w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            }`}
          >
            {/* Background High-Res Uploaded Image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-black/30" />
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="relative z-20 h-full w-full px-5 sm:px-12 md:px-16 flex flex-col justify-center text-left max-w-3xl space-y-4 sm:space-y-5">
          {/* Top Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-pink-600/40 text-pink-200 text-[11px] sm:text-xs font-black border border-pink-500/50 backdrop-blur-md self-start animate-fade-in shadow-xl">
            <Zap size={13} className="text-yellow-300 fill-yellow-300 shrink-0" />
            <span>MOXFOOD • Daily Super Offers</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight leading-[1.15] drop-shadow-lg text-white font-heading animate-zoom-in line-clamp-3">
            {currentBanner.title}
          </h2>

          {/* Subtitle */}
          {currentBanner.subtitle && (
            <p className="text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed font-medium line-clamp-2 max-w-xl">
              {currentBanner.subtitle}
            </p>
          )}

          {/* Feature Badges Strip */}
          <div className="flex flex-wrap gap-2 text-xs font-bold text-blue-100 pt-0.5">
            <div className="flex items-center gap-1.5 bg-blue-900/70 backdrop-blur-md px-3 py-1 rounded-xl border border-blue-700/60 shadow-sm text-[11px] sm:text-xs">
              <Tag size={13} className="text-pink-400" />
              <span>Up to 25% Off MRP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-900/70 backdrop-blur-md px-3 py-1 rounded-xl border border-blue-700/60 shadow-sm text-[11px] sm:text-xs">
              <ShieldCheck size={13} className="text-pink-400" />
              <span>100% Quality Guaranteed</span>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <Link
              href={currentBanner.link || '/products'}
              onClick={onExploreClick}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-pink-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer shrink-0 font-heading"
            >
              <ShoppingBag size={18} />
              <span>{currentBanner.buttonText || 'Shop Grocery Deals'}</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-blue-900/70 backdrop-blur-md border border-blue-700/60 text-xs font-bold text-pink-300 shadow font-heading">
              <Sparkles size={16} className="text-pink-400" />
              <span>Fast Express Delivery</span>
            </div>
          </div>
        </div>

        {/* Previous & Next Control Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-950/70 hover:bg-pink-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-950/70 hover:bg-pink-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Bottom Pagination Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-blue-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-6 sm:w-8 bg-pink-500 shadow-md shadow-pink-500/50' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
