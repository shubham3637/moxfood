import type { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getCanonicalUrl, generateProductSchema, SITE_NAME } from '@/lib/seo';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();

    if (!product) {
      return {
        title: 'Product Not Found | Moxfood',
        description: 'The requested healthy seed or grocery item was not found on Moxfood.',
      };
    }

    const title = `${product.name} | Buy Online at Best Price - Moxfood`;
    const description =
      product.description ||
      `Buy 100% pure & raw ${product.name} (${product.unit}) at ₹${product.price} online on Moxfood. Fast express doorstep delivery available across India.`;

    const imageUrl =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : getCanonicalUrl('/og-image.jpg');

    const canonical = getCanonicalUrl(`/product/${id}`);

    return {
      title,
      description,
      keywords: [
        product.name,
        `buy ${product.name} online`,
        `${product.name} price`,
        'moxfood healthy seeds',
        'pumpkin seeds',
        'chia seeds online',
        'raw seeds',
        'organic superfood seeds',
      ],
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: SITE_NAME,
        type: 'website',
        images: [
          {
            url: imageUrl,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    return {
      title: 'Healthy Seeds & Grocery Product | Moxfood',
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  let product: any = null;

  try {
    await dbConnect();
    const rawProduct = await Product.findById(id).lean();
    if (rawProduct) {
      product = JSON.parse(JSON.stringify(rawProduct));
    }
  } catch (err) {
    console.error('Failed to fetch product on server:', err);
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl text-center border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-800 font-heading">Product Not Found</h2>
        <p className="text-xs text-slate-500 font-medium">This product may have been removed or is unavailable.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer font-heading"
        >
          <Home size={16} />
          <span>Back to Store</span>
        </Link>
      </div>
    );
  }

  const productSchema = generateProductSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
