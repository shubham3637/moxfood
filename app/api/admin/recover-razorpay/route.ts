import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/constants';
import { pushOrderToShipmozo } from '@/lib/shipmozo';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { paymentId, customerDetails: manualDetails, items: manualItems } = body;

    if (!paymentId || !paymentId.startsWith('pay_')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Razorpay Payment ID (e.g. pay_TWkcm7opthXGYz)' },
        { status: 400 }
      );
    }

    // 1. Check if order already exists in database
    const existingOrder = await Order.findOne({
      $or: [{ razorpayPaymentId: paymentId }],
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: 'Order already exists in database',
        order: existingOrder,
      });
    }

    // 2. Fetch payment details directly from Razorpay Official API
    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const payment = await instance.payments.fetch(paymentId);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: `Payment ID ${paymentId} not found in Razorpay.` },
        { status: 404 }
      );
    }

    const totalAmount = Number(payment.amount) / 100; // Convert paise to INR
    const notes = payment.notes || {};

    // Extract customer details from notes, manual input, or payment object
    const name =
      manualDetails?.name ||
      notes.customerName ||
      notes.name ||
      payment.email?.split('@')[0] ||
      'Moxfood Customer';

    const phone =
      manualDetails?.phone ||
      notes.customerPhone ||
      notes.phone ||
      (payment.contact ? String(payment.contact).replace(/^\+91/, '') : '9624719200');

    const address =
      manualDetails?.address ||
      notes.customerAddress ||
      notes.address ||
      'Address provided during UPI Payment';

    const pincode =
      manualDetails?.pincode ||
      notes.customerPincode ||
      notes.pincode ||
      '395006';

    const items = manualItems && manualItems.length > 0
      ? manualItems
      : [
          {
            productId: 'REC-ITEM-101',
            name: notes.itemsSummary || 'Moxfood Healthy Seed Order (Recovered)',
            unit: '1 kg',
            price: totalAmount,
            quantity: 1,
            image: '/logo.png',
          },
        ];

    const subtotal = totalAmount;
    const deliveryCharge = 0;

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `MXF-${randomNum}`;

    const newOrder = await Order.create({
      orderId,
      customerDetails: {
        name,
        phone,
        address,
        pincode,
        landmark: manualDetails?.landmark || notes.landmark || '',
        deliverySlot: 'Anytime Today',
      },
      items,
      subtotal,
      deliveryCharge,
      couponCode: '',
      discountAmount: 0,
      totalAmount,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'Paid',
      status: 'Pending',
      razorpayOrderId: String(payment.order_id || ''),
      razorpayPaymentId: paymentId,
      razorpaySignature: 'RECOVERED_VIA_ADMIN',
      notes: `Recovered Payment ID: ${paymentId}. Bank RRN: ${payment.acquirer_data?.rrn || payment.vpa || 'N/A'}`,
    });

    // Auto-push to Shipmozo if possible
    try {
      await pushOrderToShipmozo(newOrder);
    } catch (e) {
      console.warn('Shipmozo push warning during order recovery:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Order #${newOrder.orderId} successfully recovered for Payment ID ${paymentId}!`,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Error recovering Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to recover Razorpay order' },
      { status: 500 }
    );
  }
}
