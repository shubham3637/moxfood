'use client';

import React from 'react';
import { X, Phone, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const WhatsAppIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

interface BulkOrderWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalWeightGrams: number;
  items?: Array<{ name: string; unit: string; quantity: number }>;
}

export default function BulkOrderWhatsAppModal({
  isOpen,
  onClose,
  totalWeightGrams,
  items = [],
}: BulkOrderWhatsAppModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const totalKg = (totalWeightGrams / 1000).toFixed(1);
  const phoneNumber = '7096396856';

  let itemSummaryText = '';
  if (items && items.length > 0) {
    itemSummaryText = items.map((i) => `${i.name} (${i.unit}) x${i.quantity}`).join(', ');
  }

  const defaultMsg =
    language === 'gu'
      ? `નમસ્તે મોક્સફૂડ, મારે ૫ કિલોથી વધુ ઓર્ડર આપવો છે (કુલ વજન: ${totalKg} kg).\nવસ્તુઓ: ${itemSummaryText}\nમહેરબાની કરીને વોટ્સએપ પર ઓર્ડર કન્ફર્મ કરી પ્રોસેસ કરી આપો.`
      : `Hello Moxfood, I want to place a bulk order above 5 kg (Total weight: ${totalKg} kg).\nItems: ${itemSummaryText}\nPlease assist me in placing this order.`;

  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="bg-emerald-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-emerald-700 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
              <WhatsAppIcon size={28} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg font-heading leading-tight">
                {language === 'gu' ? '૫ કિલોથી વધુ ઓર્ડર (Bulk Order)' : 'Bulk Order (> 5 kg)'}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {language === 'gu' ? 'વોટ્સએપ દ્વારા સંપર્ક કરો' : 'Please Place Order on WhatsApp'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-700">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs">
            <div className="font-extrabold text-amber-900 text-sm font-heading flex items-center gap-1.5">
              <span>⚠️ {language === 'gu' ? 'વેબસાઇટ પર ૫ kg સુધી જ ઓર્ડર થશે' : 'Online Checkout Restricted Above 5 kg'}</span>
            </div>
            <p className="leading-relaxed text-slate-700 font-medium">
              {language === 'gu'
                ? `તમારો ઓર્ડર ${totalKg} kg છે. ૫ કિલોથી વધુ વજનના ઓર્ડર માટે કૃપા કરીને નીચે આપેલા બટન પર ક્લિક કરી વોટ્સએપ પર જ ઓર્ડર આપો.`
                : `Your cart weight is ${totalKg} kg. For orders exceeding 5 kg, website checkout is disabled. Please place your order directly on WhatsApp.`}
            </p>
          </div>

          {/* Contact Details Card */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 font-heading">
              {language === 'gu' ? 'વોટ્સએપ ઓર્ડર હેલ્પલાઇન:' : 'WhatsApp Support Hotline:'}
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold font-mono text-sm">
              <Phone size={16} className="text-emerald-600" />
              <span>+91 7096396856</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-95 text-sm font-heading"
            >
              <WhatsAppIcon size={22} />
              <span>
                {language === 'gu' ? 'વોટ્સએપ પર ઓર્ડર કરો (WhatsApp Order)' : 'Place Order on WhatsApp'}
              </span>
            </a>

            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-2xl text-xs transition-colors font-heading"
            >
              {language === 'gu' ? 'બંધ કરો (Close)' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
