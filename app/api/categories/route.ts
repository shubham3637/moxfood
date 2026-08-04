import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, altNameGujarati, slug, image, iconName } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Category name and slug are required' },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      altNameGujarati,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      image,
      iconName,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
