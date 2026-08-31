import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { pushOrderToShipmozo } from '@/lib/shipmozo';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const shipmozoRes = await pushOrderToShipmozo(order);

    if (shipmozoRes.success) {
      await Order.findByIdAndUpdate(order._id, {
        shipmozoPushed: true,
        shipmozoReferenceId: shipmozoRes.pushData?.reference_id || orderId,
        shipmozoAwbNumber: shipmozoRes.assignData?.awb_number || '',
        shipmozoCourierName: shipmozoRes.assignData?.courier_company || '',
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully pushed order to Shipmozo',
        data: shipmozoRes,
      });
    } else {
      return NextResponse.json(
        { success: false, error: shipmozoRes.message || 'Shipmozo push failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
