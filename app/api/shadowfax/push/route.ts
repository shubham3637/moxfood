import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { pushOrderToShadowfax } from '@/lib/shadowfax';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order #${orderId} not found` },
        { status: 404 }
      );
    }

    const shadowfaxRes = await pushOrderToShadowfax(order);

    if (shadowfaxRes.success) {
      await Order.findByIdAndUpdate(order._id, {
        shadowfaxPushed: true,
        shadowfaxAwbNumber: shadowfaxRes.awbNumber || '',
        shadowfaxCourierName: shadowfaxRes.courierName || 'Shadowfax Express',
        shadowfaxStatus: shadowfaxRes.status || 'Pushed',
        shadowfaxOrderId: shadowfaxRes.shadowfaxOrderId || orderId,
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully pushed order to Shadowfax',
        awbNumber: shadowfaxRes.awbNumber,
        data: shadowfaxRes.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: shadowfaxRes.error || shadowfaxRes.message || 'Shadowfax push order failed',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Shadowfax Push Route Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
