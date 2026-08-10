'use client';

import React from 'react';
import { Star, ShieldCheck, Users, Truck, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Testimonials() {
  const { t, language } = useLanguage();

  const reviews = [
    {
      id: 1,
      name: language === 'gu' ? 'જયેશ પટેલ (આણંદ)' : 'Jayesh Patel (Anand)',
      rating: 5,
      comment:
        language === 'gu'
          ? 'મોક્સફૂડ (Moxfood) માંથી પમ્પકિન સીડ્સ અને ચિયા સીડ્સ ઓર્ડર કર્યા. ૨૦ મિનિટમાં ડિલિવરી મળી ગઈ! ક્વોલિટી ખૂબ જ ઉત્તમ છે!'
          : 'Ordered Pumpkin Seeds and Chia Seeds from Moxfood. Express home delivery within 20 mins. Superb quality!',
      date: '2 days ago',
    },
    {
      id: 2,
      name: language === 'gu' ? 'પ્રિયા શાહ (અમદાવાદ)' : 'Priya Shah (Ahmedabad)',
      rating: 5,
      comment:
        language === 'gu'
          ? 'સ્થાનિક બજાર કરતાં ઉત્તમ ભાવ અને ઈન્સ્ટન્ટ UPI પેમેન્ટ. મોક્સફૂડ ઓનલાઈન ખોરાક સેવા ખૂબ જ સરસ છે.'
          : 'Better rates than local market and easy UPI payment. Moxfood online healthy seeds service is excellent.',
      date: '1 week ago',
    },
    {
      id: 3,
      name: language === 'gu' ? 'રાજેશ દોશી (વિદ્યાનગર)' : 'Rajesh Doshi (Vidyanagar)',
      rating: 5,
      comment:
        language === 'gu'
          ? '૧૦૦% શુદ્ધ સામાન અને બ્રાન્ડેડ આઈટમ્સ. વોટ્સએપ પર ઓર્ડર ની વિગત અને ડિલિવરી તરત મળી ગઈ.'
          : '100% pure branded products. WhatsApp receipt and fast delivery service made shopping very smooth.',
      date: '3 weeks ago',
    },
  ];

  return (
    <section className="w-full space-y-8 py-4">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black border border-pink-200 font-heading">
          <ShieldCheck size={14} />
          <span>{t('testimonialsTag')}</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
          {t('testimonialsTitle')}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          {t('testimonialsSub')}
        </p>
      </div>

      {/* Customer Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-pink-300 transition-all hover:shadow-md"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400" />
              ))}
            </div>

            {/* Comment */}
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              &quot;{rev.comment}&quot;
            </p>

            {/* User Meta */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-slate-900 text-xs font-heading">{rev.name}</div>
                <div className="text-[10px] text-pink-600 font-bold">Verified Buyer</div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Stats Counter Strip */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-pink-600/30 text-pink-300 border border-pink-500/40 flex items-center justify-center mx-auto mb-2">
            <Users size={20} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">5,000+</div>
          <div className="text-[11px] text-blue-200 font-bold">{t('statFamilies')}</div>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-pink-600/30 text-pink-300 border border-pink-500/40 flex items-center justify-center mx-auto mb-2">
            <Truck size={20} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">15-30 Min</div>
          <div className="text-[11px] text-blue-200 font-bold">{t('statSpeed')}</div>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-pink-600/30 text-pink-300 border border-pink-500/40 flex items-center justify-center mx-auto mb-2">
            <Award size={20} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">100% Pure</div>
          <div className="text-[11px] text-blue-200 font-bold">{t('statQuality')}</div>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-pink-600/30 text-pink-300 border border-pink-500/40 flex items-center justify-center mx-auto mb-2">
            <Star size={20} className="fill-pink-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">4.9 / 5.0</div>
          <div className="text-[11px] text-blue-200 font-bold">{t('statRating')}</div>
        </div>
      </div>
    </section>
  );
}
