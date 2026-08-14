import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;
    const body = await request.json();

    const { name, altNameGujarati, slug, image, iconName, sortOrder, serialNumber } = body;

    const updateFields: any = {
      name,
      altNameGujarati: altNameGujarati || '',
      slug: slug ? slug.toLowerCase().replace(/\s+/g, '-') : undefined,
      image: image || '',
      iconName: iconName || 'ShoppingBag',
    };

    if (sortOrder !== undefined || serialNumber !== undefined) {
      const parsed = Number(sortOrder ?? serialNumber ?? 999);
      updateFields.sortOrder = isNaN(parsed) ? 999 : parsed;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
