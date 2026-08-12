import type { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getCanonicalUrl, generateProductSchema, SITE_NAME } from '@/lib/seo';
import Link from 'next/link';
import { Home } from 'lucide-react';
import mongoose from 'mongoose';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function findProductByIdOrSlug(idOrSlug: string) {
  await dbConnect();

  // Try finding by slug first (clean URL)
  let product = await Product.findOne({ slug: idOrSlug.toLowerCase().trim() }).lean();

  // If not found by slug and it's a valid ObjectId, try finding by _id
  if (!product && mongoose.Types.ObjectId.isValid(idOrSlug)) {
    product = await Product.findById(idOrSlug).lean();
  }

  // Fallback: match slug with hyphens or regex
  if (!product) {
    const slugified = idOrSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    product = await Product.findOne({ slug: slugified }).lean();
  }

  return product;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product: any = await findProductByIdOrSlug(id);

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

    const canonical = getCanonicalUrl(`/product/${product.slug || product._id}`);

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
    const rawProduct = await findProductByIdOrSlug(id);
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
