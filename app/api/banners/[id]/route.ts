import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Banner from '@/models/Banner';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;
    const deletedBanner = await Banner.findByIdAndDelete(id);
    if (!deletedBanner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
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
    const updatedBanner = await Banner.findByIdAndUpdate(id, body, { new: true });
    if (!updatedBanner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, banner: updatedBanner });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
