import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import { seedCategories, seedProducts, seedBanners } from '@/lib/seed-data';

export async function GET(request: Request) {
  return handleSeed(request);
}

export async function POST(request: Request) {
  return handleSeed(request);
}

async function handleSeed(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Clear existing if force=true
    if (force) {
      await Category.deleteMany({});
      await Product.deleteMany({});
      await Banner.deleteMany({});
    }

    const categoryCount = await Category.countDocuments();
    let categoriesCreated = 0;
    if (categoryCount === 0 || force) {
      await Category.insertMany(seedCategories);
      categoriesCreated = seedCategories.length;
    }

    const productCount = await Product.countDocuments();
    let productsCreated = 0;
    if (productCount === 0 || force) {
      await Product.insertMany(seedProducts);
      productsCreated = seedProducts.length;
    }

    const bannerCount = await Banner.countDocuments();
    let bannersCreated = 0;
    if (bannerCount === 0 || force) {
      await Banner.insertMany(seedBanners);
      bannersCreated = seedBanners.length;
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      details: {
        categoriesInserted: categoriesCreated,
        productsInserted: productsCreated,
        bannersInserted: bannersCreated,
        totalCategories: await Category.countDocuments(),
        totalProducts: await Product.countDocuments(),
        totalBanners: await Banner.countDocuments(),
      },
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}
