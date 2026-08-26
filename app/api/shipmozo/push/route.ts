import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { pushOrderToShipmozo } from '@/lib/shipmozo';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
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
        message: 'Order pushed to Shipmozo successfully',
        data: shipmozoRes,
      });
    }

    const errorMsg =
      shipmozoRes.pushData?.error ||
      shipmozoRes.error ||
      shipmozoRes.message ||
      'Failed to push order to Shipmozo';

    return NextResponse.json({
      success: false,
      error: errorMsg,
      data: shipmozoRes,
    }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
