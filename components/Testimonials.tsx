'use client';

import React from 'react';
import { Star, Quote, HeartHandshake, ShieldCheck, Users, Truck, ThumbsUp } from 'lucide-react';

export default function Testimonials() {
  const stats = [
    { icon: <Users size={24} className="text-pink-400" />, count: '10,000+', label: 'Happy Local Families' },
    { icon: <Truck size={24} className="text-pink-400" />, count: '15-30 Min', label: 'Fast Express Delivery' },
    { icon: <ShieldCheck size={24} className="text-pink-400" />, count: '100%', label: 'Pure Branded Grocery' },
    { icon: <ThumbsUp size={24} className="text-pink-400" />, count: '4.9 / 5', label: 'Verified Customer Rating' },
  ];

  const reviews = [
    {
      name: 'Rameshbhai Patel',
      location: 'Anand Store Customer',
      comment: 'Ordered wheat flour and edible oil from Gautam Trading. Express home delivery within 20 mins. Superb quality!',
      rating: 5,
    },
    {
      name: 'Sunitaben Shah',
      location: 'Ahmedabad Customer',
      comment: 'Better rates than local market and easy UPI payment. Gautam Trading online grocery service is excellent.',
      rating: 5,
    },
    {
      name: 'Jayeshbhai Joshi',
      location: 'Nadiad Customer',
      comment: 'Desi Toor Dal and Wagh Bakri Tea were fresh. Order receipt on WhatsApp is very convenient.',
      rating: 5,
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl my-12 space-y-10 border border-blue-800/80 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Live Stats Counter Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-blue-800/80">
        {stats.map((st, idx) => (
          <div key={idx} className="bg-blue-900/50 backdrop-blur-md p-4 rounded-2xl border border-blue-700/60 text-center space-y-1.5 hover:border-pink-500/50 transition-colors">
            <div className="flex justify-center mb-1">{st.icon}</div>
            <div className="text-2xl md:text-3xl font-black text-white font-heading">{st.count}</div>
            <div className="text-xs text-blue-200 font-semibold">{st.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonials Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-600/30 text-pink-300 text-xs font-black border border-pink-500/40 shadow">
          <HeartHandshake size={15} />
          <span>CUSTOMER TRUST • Verified Local Reviews</span>
        </div>
        <h3 className="text-2xl md:text-4xl font-black font-heading">What Our Customers Say</h3>
        <p className="text-xs md:text-sm text-blue-200 font-medium">Trusted by thousands of local families across Anand & Ahmedabad</p>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-blue-950/80 backdrop-blur-md p-6 rounded-3xl border border-blue-800 space-y-4 hover:border-pink-500/60 hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-1 text-pink-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} className="fill-pink-400" />
                ))}
              </div>
              <Quote size={22} className="text-blue-700 opacity-60" />
            </div>

            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              &quot;{rev.comment}&quot;
            </p>

            <div className="pt-3 border-t border-blue-900 flex justify-between items-center text-xs">
              <span className="font-extrabold text-white font-heading">{rev.name}</span>
              <span className="text-[11px] text-pink-300 font-semibold">{rev.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
