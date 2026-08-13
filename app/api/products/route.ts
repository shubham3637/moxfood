import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');

    const queryFilter: any = {};

    if (category && category !== 'all') {
      if (category === 'dry-fruits') {
        queryFilter.$or = [
          { category: 'dry-fruits' },
          { category: 'dryfruits' },
          { category: /dry.*fruit/i },
          { name: /almond|badam|kaju|cashew|walnut|kishmish|raisin|pista|date/i },
        ];
      } else if (category === 'seeds-superfoods' || category === 'seeds') {
        queryFilter.$or = [
          { category: 'seeds-superfoods' },
          { category: 'seeds' },
          { category: /seed/i },
          { name: /seed|chia|pumpkin|sunflower|flax|alsi|sabja|watermelon|kalonji/i },
        ];
      } else {
        queryFilter.category = category;
      }
    }

    if (featured === 'true') {
      queryFilter.isFeatured = true;
    }

    if (trending === 'true') {
      queryFilter.isTrending = true;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      queryFilter.$or = [
        { name: searchRegex },
        { altNameGujarati: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ];
    }

    const products = await Product.find(queryFilter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      name,
      slug: customSlug,
      altNameGujarati,
      category,
      price,
      mrp,
      stock,
      unit,
      variants,
      images,
      description,
      isFeatured,
      isTrending,
    } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      );
    }

    const generatedSlug =
      customSlug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const product = await Product.create({
      name,
      slug: generatedSlug,
      altNameGujarati: altNameGujarati || '',
      category,
      price: Number(price || 0),
      mrp: Number(mrp || 0),
      stock: Number(stock || 0),
      unit: unit || '1 Pack',
      variants: Array.isArray(variants) ? variants : [],
      images: Array.isArray(images) ? images : images ? [images] : [],
      description: description || '',
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
