import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import DraftOrder from '@/models/DraftOrder';
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

      // Try finding pre-payment DraftOrder in MongoDB
      const draftOrder = razorpayOrderId ? await DraftOrder.findOne({ razorpayOrderId }) : null;

      // Order does NOT exist in database! Let's reconstruct & create it from draftOrder / payment & notes
      const notes = payment.notes || {};
      const totalAmount = Number(payment.amount) / 100 || draftOrder?.totalAmount || 0;

      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const orderId = `MXF-${randomNum}`;

      const name = draftOrder?.customerDetails?.name || notes.customerName || notes.name || payment.email?.split('@')[0] || 'Moxfood Customer';
      const phone = draftOrder?.customerDetails?.phone || notes.customerPhone || notes.phone || (payment.contact ? String(payment.contact).replace(/^\+91/, '') : '');
      const address = draftOrder?.customerDetails?.address || notes.customerAddress || notes.address || 'Address registered during online payment';
      const pincode = draftOrder?.customerDetails?.pincode || notes.customerPincode || notes.pincode || '395006';
      const landmark = draftOrder?.customerDetails?.landmark || notes.landmark || '';

      const items = (draftOrder?.items && draftOrder.items.length > 0)
        ? draftOrder.items
        : [
            {
              productId: 'RZP-WEBHOOK-ITEM',
              name: notes.itemsSummary || 'Moxfood Healthy Seed Order (Webhook Captured)',
              unit: '1 kg',
              price: totalAmount,
              quantity: 1,
              image: '/logo.png',
            },
          ];

      const subtotal = draftOrder?.subtotal || totalAmount;
      const deliveryCharge = draftOrder?.deliveryCharge || 0;
      const discountAmount = draftOrder?.discountAmount || 0;
      const couponCode = draftOrder?.couponCode || '';

      const newOrder = await Order.create({
        orderId,
        customerDetails: {
          name,
          phone,
          address,
          pincode,
          landmark,
          deliverySlot: 'Anytime Today',
        },
        items,
        subtotal,
        deliveryCharge,
        couponCode,
        discountAmount,
        totalAmount,
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'Paid',
        status: 'Pending',
        razorpayOrderId: String(razorpayOrderId || ''),
        razorpayPaymentId: paymentId,
        razorpaySignature: signature || 'WEBHOOK_CAPTURED',
        notes: `Auto-captured via Razorpay Webhook (${event}). Bank RRN: ${payment.acquirer_data?.rrn || payment.vpa || 'N/A'}`,
      });

      if (draftOrder) {
        await DraftOrder.findByIdAndUpdate(draftOrder._id, { status: 'Converted', paymentStatus: 'Paid' });
      }

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
