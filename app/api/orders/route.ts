import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { pushOrderToShipmozo } from '@/lib/shipmozo';

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

    const {
      customerDetails,
      items,
      paymentMethod,
      deliveryCharge: bodyDeliveryCharge,
      couponCode,
      discountAmount: bodyDiscountAmount,
      notes,
    } = body;

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

    const deliveryCharge = Number(bodyDeliveryCharge) || 0;
    const discountAmount = Number(bodyDiscountAmount) || 0;
    const totalAmount = Math.max(0, subtotal + deliveryCharge - discountAmount);

    // Generate unique Order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `GT-${randomNum}`;

    const newOrder = await Order.create({
      orderId,
      customerDetails,
      items,
      subtotal,
      deliveryCharge,
      couponCode: couponCode || '',
      discountAmount,
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

    // Push order details automatically to Shipmozo panel
    try {
      const shipmozoRes = await pushOrderToShipmozo(newOrder);
      if (shipmozoRes.success) {
        await Order.findByIdAndUpdate(newOrder._id, {
          shipmozoPushed: true,
          shipmozoReferenceId: shipmozoRes.pushData?.reference_id || orderId,
          shipmozoAwbNumber: shipmozoRes.assignData?.awb_number || '',
          shipmozoCourierName: shipmozoRes.assignData?.courier_company || '',
        });
      }
    } catch (sErr) {
      console.warn('Background Shipmozo push notification failed:', sErr);
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
