import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { pushOrderToShadowfax } from '@/lib/shadowfax';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const queryFilter: any = {};
    if (status && status !== 'all') {
      queryFilter.status = status;
    }

    const orders = await Order.find(queryFilter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { customerDetails, items, paymentMethod, deliveryCharge: bodyDeliveryCharge, notes } = body;

    if (
      !customerDetails ||
      !customerDetails.name ||
      !customerDetails.phone ||
      !customerDetails.address ||
      !customerDetails.pincode
    ) {
      return NextResponse.json(
        { success: false, error: 'Customer name, phone, address, and 6-digit Pincode are required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce((acc: number, item: any) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0);

    // Dynamic Delivery charge passed from checkout or defaulted
    const deliveryCharge = Number(bodyDeliveryCharge) || 0;
    const totalAmount = subtotal + deliveryCharge;

    // Generate unique Order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `GT-${randomNum}`;

    const newOrder = await Order.create({
      orderId,
      customerDetails,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      status: 'Pending',
      notes: notes || '',
    });

    // Reduce stock quantity for ordered products
    for (const item of items) {
      if (item.productId) {
        try {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
          });
        } catch (err) {
          console.warn(`Failed to update stock for product ${item.productId}:`, err);
        }
      }
    }

    // Push order details automatically to Shadowfax panel
    try {
      const shadowfaxRes = await pushOrderToShadowfax(newOrder);
      if (shadowfaxRes.success) {
        await Order.findByIdAndUpdate(newOrder._id, {
          shadowfaxPushed: true,
          shadowfaxAwbNumber: shadowfaxRes.awbNumber || '',
          shadowfaxCourierName: shadowfaxRes.courierName || 'Shadowfax Express',
          shadowfaxStatus: shadowfaxRes.status || 'Pushed',
          shadowfaxOrderId: shadowfaxRes.shadowfaxOrderId || orderId,
        });
      }
    } catch (sErr) {
      console.warn('Background Shadowfax push notification failed:', sErr);
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
