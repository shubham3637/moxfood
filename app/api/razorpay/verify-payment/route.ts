import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { RAZORPAY_KEY_SECRET } from '@/lib/constants';
import { pushOrderToShipmozo } from '@/lib/shipmozo';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      items,
      deliveryCharge: clientDeliveryCharge,
      weightSummary,
      notes,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: 'Razorpay payment details are missing' },
        { status: 400 }
      );
    }

    // Generate expected signature for verification
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    // Calculate subtotal and delivery charge
    const subtotal = items.reduce((acc: number, item: any) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0);

    const deliveryCharge =
      Number(clientDeliveryCharge) ?? Number(weightSummary?.shippingFee) ?? 0;
    const totalAmount = subtotal + deliveryCharge;

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `MXF-${randomNum}`;

    const newOrder = await Order.create({
      orderId,
      customerDetails,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod: 'RAZORPAY',
      paymentStatus: isSignatureValid || razorpay_payment_id ? 'Paid' : 'Pending',
      status: 'Pending',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || '',
      notes: notes || '',
    });

    // Stock update for ordered products
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
      console.warn('Background Shipmozo push failed:', sErr);
    }

    return NextResponse.json({
      success: true,
      verified: isSignatureValid,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Razorpay payment verification failed' },
      { status: 500 }
    );
  }
}
