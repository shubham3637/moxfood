import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Mobile number or Order ID is required' },
        { status: 400 }
      );
    }

    const cleanQuery = query.replace(/[^a-zA-Z0-9-]/g, '');

    // Search by exact orderId or phone number
    const orders = await Order.find({
      $or: [
        { orderId: { $regex: cleanQuery, $options: 'i' } },
        { 'customerDetails.phone': { $regex: cleanQuery, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
