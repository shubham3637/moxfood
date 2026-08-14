'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
  _id?: string;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
}

interface HeroSliderProps {
  onExploreClick?: () => void;
}

export default function HeroSlider({ onExploreClick }: HeroSliderProps) {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
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
      if (data.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error('Failed to fetch hero slider banners:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play carousel interval every 3.5 seconds
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

  if (loading || banners.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-slate-800 group my-2 sm:my-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-Width Carousel Banner Image Slider (Clean Photo, No Overlays or Text) */}
      <div className="relative h-[220px] xs:h-[280px] sm:h-[380px] md:h-[480px] lg:h-[520px] w-full overflow-hidden">
        {banners.map((banner, index) => {
          const isCurrent = index === currentIndex;
          const ImageWrapper = banner.link ? Link : 'div';

          return (
            <div
              key={banner._id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <ImageWrapper
                href={banner.link || '#'}
                onClick={onExploreClick}
                className="block w-full h-full cursor-pointer"
              >
                {/* Pure Uploaded Banner Image Without Overlays or Text */}
                <img
                  src={banner.image}
                  alt={banner.title || `Banner ${index + 1}`}
                  className="w-full h-full object-cover object-center rounded-3xl"
                />
              </ImageWrapper>
            </div>
          );
        })}

        {/* Carousel Prev & Next Control Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-pink-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Previous Banner Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-pink-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Next Banner Slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Carousel Bottom Indicator Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-md">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to banner slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 sm:w-8 bg-pink-500 shadow-md shadow-pink-500/50'
                    : 'w-2 bg-white/50 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
