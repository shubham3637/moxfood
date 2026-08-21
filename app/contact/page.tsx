'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const InstagramIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    // Trigger WhatsApp pre-filled message directly for instant support
    const text = `Hello Moxfood Support,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    const waUrl = `https://wa.me/917096396856?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 md:px-10 lg:px-16 space-y-10">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-extrabold text-xs px-4 py-1.5 rounded-full border border-pink-200 font-heading">
          <PhoneCall size={14} />
          <span>{language === 'gu' ? 'અમારો સંપર્ક કરો' : 'GET IN TOUCH WITH US'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {language === 'gu' ? 'ગ્રાહક સહાય અને સંપર્ક' : 'Customer Support & Store Details'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {language === 'gu'
            ? 'ઓર્ડર, સીડ્સ ક્વાલિટી અથવા ડિલિવરી અંગેની કોઈ પણ પૂછપરછ માટે સંપર્ક કરો.'
            : 'Have questions regarding your order, seed quality, or wholesale rates? Reach out to us anytime!'}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 font-heading border-b border-slate-100 pb-3">
              Moxfood Store Location
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Address</span>
                  <span className="text-slate-900 font-extrabold font-heading">Gautam Trading, Surat</span>
                  <p className="text-slate-500 font-medium">Surat, Gujarat, India - 395006</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone & WhatsApp</span>
                  <a href="tel:+917096396856" className="text-pink-600 font-extrabold font-heading hover:underline block">
                    +91 7096396856
                  </a>
                  <span className="text-slate-500 font-medium text-[11px]">Instant WhatsApp Helpline Available</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <InstagramIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Instagram Handle</span>
                  <a
                    href="https://www.instagram.com/gautamoilandsugar?igsh=MTN2YXV3cDB1bmgxaw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 font-extrabold font-heading hover:underline"
                  >
                    @gautamoilandsugar
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Working Hours</span>
                  <span className="text-slate-900 font-bold">Monday - Sunday: 8:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/917096396856"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer font-heading text-xs"
            >
              <MessageCircle size={18} />
              <span>Chat Directly on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
            <h3 className="font-extrabold text-lg text-slate-900 font-heading">
              {language === 'gu' ? 'સંદેશો મોકલો' : 'Send Us a Message'}
            </h3>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base font-heading">Inquiry Sent via WhatsApp!</h4>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 7096396856"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Message or Inquiry *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your questions about products, seed quality, or order delivery..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs"
                >
                  <Send size={16} />
                  <span>Send Inquiry on WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
