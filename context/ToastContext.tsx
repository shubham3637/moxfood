'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}

      {/* Floating Top Toast Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-md w-[92%] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-bold transition-all transform animate-bounce-short ${
              toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-100 border-rose-800 shadow-rose-950/50'
                : toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-800 shadow-emerald-950/50'
                : 'bg-blue-950/95 text-blue-100 border-blue-800 shadow-blue-950/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' && (
                <AlertCircle size={20} className="text-rose-400 shrink-0 animate-pulse" />
              )}
              {toast.type === 'success' && (
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info size={20} className="text-blue-400 shrink-0" />
              )}
              <span className="leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
