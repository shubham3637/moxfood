import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

async function findProduct(idOrSlug: string) {
  let product = await Product.findOne({ slug: idOrSlug.toLowerCase().trim() });
  if (!product && mongoose.Types.ObjectId.isValid(idOrSlug)) {
    product = await Product.findById(idOrSlug);
  }
  return product;
}

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;
    const product = await findProduct(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;
    const body = await request.json();

    if (body.name && !body.slug) {
      body.slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    let updatedProduct;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedProduct = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      updatedProduct = await Product.findOneAndUpdate({ slug: id.toLowerCase() }, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;

    let deletedProduct;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedProduct = await Product.findByIdAndDelete(id);
    } else {
      deletedProduct = await Product.findOneAndDelete({ slug: id.toLowerCase() });
    }

    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
