import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // Amount in paise (e.g. ₹170 -> 17000)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
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
