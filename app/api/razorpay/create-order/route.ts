import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/db';
import DraftOrder from '@/models/DraftOrder';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customerDetails, items, subtotal, deliveryCharge, discountAmount, couponCode } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    await dbConnect();

    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const itemsSummary = Array.isArray(items)
      ? items.map((i: any) => `${i.name} (${i.unit}) x${i.quantity}`).join(', ').slice(0, 240)
      : '';

    const options = {
      amount: Math.round(Number(amount) * 100), // Amount in paise (e.g. ₹170 -> 17000)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        customerName: (customerDetails?.name || '').slice(0, 40),
        customerPhone: (customerDetails?.phone || '').slice(0, 15),
        customerAddress: (customerDetails?.address || '').slice(0, 200),
        customerPincode: (customerDetails?.pincode || '').slice(0, 10),
        landmark: (customerDetails?.landmark || '').slice(0, 50),
        itemsSummary,
      },
    };

    const razorpayOrder = await instance.orders.create(options);

    // Save pre-payment DraftOrder in MongoDB table BEFORE payment popup opens
    const draftId = `DFT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const draftOrderData = {
      draftId,
      razorpayOrderId: razorpayOrder.id,
      customerDetails: {
        name: (customerDetails?.name || '').trim(),
        phone: (customerDetails?.phone || '').trim(),
        address: (customerDetails?.address || '').trim(),
        pincode: (customerDetails?.pincode || '').trim(),
        landmark: (customerDetails?.landmark || '').trim(),
        state: (customerDetails?.state || '').trim(),
        district: (customerDetails?.district || '').trim(),
        deliverySlot: customerDetails?.deliverySlot || 'Anytime Today',
      },
      items: Array.isArray(items)
        ? items.map((it: any) => ({
            productId: String(it.productId),
            name: String(it.name),
            unit: String(it.unit || '1 pack'),
            price: Number(it.price) || 0,
            quantity: Number(it.quantity) || 1,
            image: String(it.image || ''),
          }))
        : [],
      subtotal: Number(subtotal) || Number(amount),
      deliveryCharge: Number(deliveryCharge) || 0,
      couponCode: couponCode || '',
      discountAmount: Number(discountAmount) || 0,
      totalAmount: Number(amount),
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'Pending' as const,
      status: 'Initiated' as const,
    };

    await DraftOrder.create(draftOrderData);
    console.log('Saved pre-payment DraftOrder in MongoDB:', draftId, 'Razorpay Order:', razorpayOrder.id);

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      draftId,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    const errDesc =
      error?.error?.description ||
      error?.description ||
      error?.message ||
      'Razorpay authentication failed. Please verify Razorpay API Keys.';

    return NextResponse.json(
      { success: false, error: `Razorpay Order Error: ${errDesc}` },
      { status: 500 }
    );
  }
}
