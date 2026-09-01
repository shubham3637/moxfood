'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCartBar from '@/components/FloatingCartBar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <FloatingCartBar />
      <FloatingWhatsApp />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
