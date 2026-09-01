import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/constants';
import { pushOrderToShipmozo } from '@/lib/shipmozo';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Parse JSON payload
    let eventPayload: any = {};
    try {
      eventPayload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const event = eventPayload.event;

    // Handle payment.captured or order.paid events
    if (event === 'payment.captured' || event === 'order.paid') {
      await dbConnect();

      const payment = eventPayload.payload?.payment?.entity || {};
      const paymentId = payment.id;
      const razorpayOrderId = payment.order_id;

      if (!paymentId) {
        return NextResponse.json({ success: true, message: 'No payment ID in webhook' });
      }

      // Check if order already exists in database
      const existingOrder = await Order.findOne({
        $or: [{ razorpayPaymentId: paymentId }, { razorpayOrderId: razorpayOrderId }],
      });

      if (existingOrder) {
        // Ensure paymentStatus is Paid
        if (existingOrder.paymentStatus !== 'Paid') {
          await Order.findByIdAndUpdate(existingOrder._id, { paymentStatus: 'Paid' });
        }
        return NextResponse.json({ success: true, message: 'Order already exists' });
      }

      // Order does NOT exist in database! Let's reconstruct & create it from payment & notes
      const notes = payment.notes || {};
      const totalAmount = Number(payment.amount) / 100;

      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const orderId = `MXF-${randomNum}`;

      const name = notes.customerName || notes.name || payment.email?.split('@')[0] || 'Moxfood Customer';
      const phone = notes.customerPhone || notes.phone || (payment.contact ? String(payment.contact).replace(/^\+91/, '') : '');
      const address = notes.customerAddress || notes.address || 'Address registered during online payment';
      const pincode = notes.customerPincode || notes.pincode || '395006';

      const items = [
        {
          productId: 'RZP-WEBHOOK-ITEM',
          name: notes.itemsSummary || 'Moxfood Healthy Seed Order (Webhook Captured)',
          unit: '1 kg',
          price: totalAmount,
          quantity: 1,
          image: '/logo.png',
        },
      ];

      const newOrder = await Order.create({
        orderId,
        customerDetails: {
          name,
          phone,
          address,
          pincode,
          landmark: notes.landmark || '',
          deliverySlot: 'Anytime Today',
        },
        items,
        subtotal: totalAmount,
        deliveryCharge: 0,
        couponCode: '',
        discountAmount: 0,
        totalAmount,
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'Paid',
        status: 'Pending',
        razorpayOrderId: String(razorpayOrderId || ''),
        razorpayPaymentId: paymentId,
        razorpaySignature: signature || 'WEBHOOK_CAPTURED',
        notes: `Auto-captured via Razorpay Webhook (${event}). Bank RRN: ${payment.acquirer_data?.rrn || payment.vpa || 'N/A'}`,
      });

      // Push to Shipmozo automatically
      try {
        await pushOrderToShipmozo(newOrder);
      } catch (e) {
        console.warn('Shipmozo push warning in Webhook:', e);
      }

      return NextResponse.json({
        success: true,
        message: 'Order created successfully from Webhook',
        orderId: newOrder.orderId,
      });
    }

    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
