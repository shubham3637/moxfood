import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DraftOrder from '@/models/DraftOrder';
import Order from '@/models/Order';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Auto-update status for draft orders that have a matching confirmed Order in DB
    try {
      const confirmedOrders = await Order.find({ razorpayOrderId: { $exists: true, $ne: '' } }, { razorpayOrderId: 1 });
      const confirmedRzpIds: string[] = confirmedOrders
        .map((o) => o.razorpayOrderId)
        .filter((id): id is string => Boolean(id));

      if (confirmedRzpIds.length > 0) {
        await DraftOrder.updateMany(
          { razorpayOrderId: { $in: confirmedRzpIds }, status: 'Initiated' },
          { status: 'Converted', paymentStatus: 'Paid' }
        );
      }
    } catch (sErr) {
      console.warn('Auto-reconcile draft orders error:', sErr);
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const queryFilter: any = {};
    if (startDate || endDate) {
      queryFilter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        queryFilter.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        queryFilter.createdAt.$lte = end;
      }
    }

    const draftOrders = await DraftOrder.find(queryFilter).sort({ createdAt: -1 }).limit(200);
    return NextResponse.json({ success: true, draftOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
