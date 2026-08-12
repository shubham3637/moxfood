import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getCanonicalUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalUrl();

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  // Dynamic Product Page routes with clean SEO slugs
  try {
    await dbConnect();
    const products = await Product.find({}).select('_id slug updatedAt').lean();

    const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.slug || product._id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error('Error generating sitemap product routes:', error);
    return routes;
  }
}
