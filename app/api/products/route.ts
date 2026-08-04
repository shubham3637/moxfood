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
      queryFilter.category = category;
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
      altNameGujarati,
      category,
      price,
      mrp,
      stock,
      unit,
      images,
      description,
      isFeatured,
      isTrending,
    } = body;

    if (!name || !category || price === undefined || mrp === undefined || stock === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, category, price, MRP, and stock are required' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      altNameGujarati: altNameGujarati || '',
      category,
      price: Number(price),
      mrp: Number(mrp),
      stock: Number(stock),
      unit: unit || '1 kg',
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
