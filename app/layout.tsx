import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ToastProvider } from '@/context/ToastContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import {
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_DESCRIPTION_DEFAULT,
  DEFAULT_KEYWORDS,
  getCanonicalUrl,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateStoreSchema,
} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_DEFAULT,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: 'Moxfood' }],
  creator: 'Moxfood',
  publisher: 'Moxfood',
  applicationName: 'Moxfood Store',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: getCanonicalUrl(),
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: getCanonicalUrl(),
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION_DEFAULT,
    siteName: SITE_NAME,
    images: [
      {
        url: getCanonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Moxfood - Premium Healthy Seeds & Superfood Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION_DEFAULT,
    images: [getCanonicalUrl('/logo.png')],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const storeSchema = generateStoreSchema();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-pink-600 selection:text-white">
        <LanguageProvider>
          <ToastProvider>
            <CartProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </CartProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
