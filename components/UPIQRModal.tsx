'use client';

import React, { useState } from 'react';
import { QrCode, X, CheckCircle, ShieldCheck, Copy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface UPIQRModalProps {
  amount: number;
  orderId?: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirmed: () => void;
}

export default function UPIQRModal({
  amount,
  orderId = 'Pending',
  isOpen,
  onClose,
  onPaymentConfirmed,
}: UPIQRModalProps) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const upiId = 'moxfood@upi'; // Demo Store UPI
  const payeeName = 'Moxfood Store';

  // Standard UPI URI format for GPay, PhonePe, Paytm QR scanning
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=Order%20Payment%20Moxfood`;

  // Quick QR API URL for rendering instant QR Code
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiUri
  )}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-5 animate-zoom-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
            <QrCode size={26} />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">{t('upiModalTitle')}</h2>
          <p className="text-xs text-slate-500 font-medium">{t('upiModalSub')}</p>
        </div>

        {/* Amount Badge */}
        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200 text-center space-y-1">
          <div className="text-xs text-pink-900 font-extrabold">{t('payableAmount')}</div>
          <div className="text-3xl font-black text-slate-900 font-heading">₹{amount}</div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="p-3 bg-white rounded-2xl border-2 border-pink-500 shadow-md">
            <img src={qrImageUrl} alt="UPI QR Code" className="w-48 h-48 object-contain" />
          </div>
          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-pink-600" />
            <span>GPay • PhonePe • Paytm • BHIM UPI</span>
          </div>
        </div>

        {/* Copy UPI ID Bar */}
        <div className="flex items-center justify-between bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono">
          <span className="text-slate-600 font-semibold truncate">UPI ID: {upiId}</span>
          <button
            onClick={handleCopyUPI}
            className="text-pink-600 hover:text-pink-500 font-extrabold flex items-center gap-1 cursor-pointer shrink-0 font-sans"
          >
            {copied ? (
              <>
                <CheckCircle size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
        </div>

        {/* Confirm Payment Button */}
        <button
          onClick={onPaymentConfirmed}
          className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-pink-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-sm"
        >
          <CheckCircle size={18} />
          <span>{t('iHavePaid')}</span>
        </button>
      </div>
    </div>
  );
}
