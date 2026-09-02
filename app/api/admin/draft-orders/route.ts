import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DraftOrder from '@/models/DraftOrder';

export async function GET() {
  try {
    await dbConnect();
    const draftOrders = await DraftOrder.find({}).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, draftOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
