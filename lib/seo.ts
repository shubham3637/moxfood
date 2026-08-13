import { APP_URL } from '@/lib/constants';

export const SITE_NAME = 'Moxfood';
export const SITE_TITLE_DEFAULT = 'Moxfood - Buy Premium Healthy Seeds, Pumpkin Seeds, Chia Seeds & Dry Fruits Online';
export const SITE_DESCRIPTION_DEFAULT =
  'Shop 100% pure & raw healthy seeds online at Moxfood. Buy raw & roasted Pumpkin Seeds, Chia Seeds, Sunflower Seeds, Flax Seeds, Watermelon Seeds, Seed Mixes & premium dry fruits with fast doorstep delivery in Surat.';

export const DEFAULT_KEYWORDS = [
  'Moxfood',
  'mox food',
  'moxfood healthy seeds',
  'buy healthy seeds online',
  'pumpkin seeds online',
  'chia seeds online',
  'sunflower seeds',
  'flax seeds',
  'watermelon seeds',
  'muskmelon seeds',
  'roasted seed mix',
  'superfood seeds',
  'organic chia seeds',
  'raw pumpkin seeds',
  'dry fruits and seeds online',
  'healthy snacks India',
  'keto seeds mix',
  'diet seeds for weight loss',
  'fresh grocery seeds',
  'moxfood online store',
];

export function getCanonicalUrl(path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${APP_URL}${cleanPath}`;
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Moxfood',
    alternateName: ['Mox Food', 'Moxfood Healthy Seeds Store'],
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    sameAs: [
      'https://www.instagram.com/gautamtrading_',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7096396856',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Gujarati'],
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Moxfood',
    url: APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateStoreSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: 'Moxfood - Healthy Seeds & Superfood Store',
    image: `${APP_URL}/logo.png`,
    url: APP_URL,
    telephone: '+91-7096396856',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gautam Trading, Surat',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      postalCode: '395006',
      addressCountry: 'IN',
    },
    priceRange: '₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '21:00',
      },
    ],
  };
}

export function generateProductSchema(product: {
  _id: string;
  name: string;
  description?: string;
  price: number;
  mrp?: number;
  images?: string[];
  category?: string;
  stock?: number;
}) {
  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : `${APP_URL}/logo.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description:
      product.description ||
      `Buy 100% fresh and high quality ${product.name} at best prices online on Moxfood.`,
    sku: product._id,
    brand: {
      '@type': 'Brand',
      name: 'Moxfood',
    },
    offers: {
      '@type': 'Offer',
      url: `${APP_URL}/product/${product._id}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2030-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        (product.stock ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Moxfood',
      },
    },
  };
}
