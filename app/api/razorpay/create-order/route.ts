import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/constants';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customerDetails, items } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

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

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
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
