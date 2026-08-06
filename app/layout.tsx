import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCartBar from '@/components/FloatingCartBar';

export const metadata: Metadata = {
  title: 'Gautam Trading - General Grocery Super Store',
  description: 'Order fresh grocery, wheat flour, sunflower oil, pulses, and tea at best prices online with fast home delivery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-pink-600 selection:text-white">
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <FloatingCartBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
