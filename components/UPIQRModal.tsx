'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, CheckCircle, QrCode } from 'lucide-react';

interface UPIQRModalProps {
  amount: number;
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirmed: () => void;
}

export default function UPIQRModal({
  amount,
  orderId,
  isOpen,
  onClose,
  onPaymentConfirmed,
}: UPIQRModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const upiId = 'gautamtrading@upi'; // Demo Store UPI
  const payeeName = 'Gautam Trading';

  useEffect(() => {
    if (isOpen && amount > 0) {
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
        payeeName
      )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`;

      QRCode.toDataURL(upiString, { width: 280, margin: 2 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Failed to generate QR code:', err));
    }
  }, [isOpen, amount, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          aria-label="Close UPI QR"
        >
          <X size={20} />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-900 rounded-full text-xs font-bold mb-3 border border-pink-200">
          <QrCode size={14} className="text-pink-600" /> Instant UPI Scan & Pay
        </div>

        <h3 className="font-extrabold text-slate-900 text-lg">
          Scan QR & Pay via UPI
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Scan QR code using GPay, PhonePe, Paytm or BHIM app.
        </p>

        {/* QR Code Container */}
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 inline-block mb-4">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="UPI QR Code" className="w-56 h-56 mx-auto rounded-lg shadow" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        <div className="space-y-1 text-xs mb-5">
          <div className="font-extrabold text-blue-950 text-base">Payable Amount: ₹{amount}</div>
          <div className="text-slate-600">UPI ID: <span className="font-mono font-bold text-pink-600">{upiId}</span></div>
          <div className="text-slate-500">Order ID: #{orderId}</div>
        </div>

        <button
          onClick={onPaymentConfirmed}
          className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <CheckCircle size={18} />
          <span>I Have Paid</span>
        </button>
      </div>
    </div>
  );
}
