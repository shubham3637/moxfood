import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import DraftOrder from '@/models/DraftOrder';
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
      couponCode,
      discountAmount: clientDiscountAmount,
      weightSummary,
      notes,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: 'Razorpay payment details are missing' },
        { status: 400 }
      );
    }

    // 1. Check if order already exists to prevent duplicate order creation
    const existingOrder = await Order.findOne({
      $or: [{ razorpayPaymentId: razorpay_payment_id }, { razorpayOrderId: razorpay_order_id }],
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        verified: true,
        order: existingOrder,
      });
    }

    // Try finding pre-payment DraftOrder in MongoDB
    const draftOrder = razorpay_order_id ? await DraftOrder.findOne({ razorpayOrderId: razorpay_order_id }) : null;

    // Generate expected signature for verification
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    const rawItems = (items && items.length > 0) ? items : (draftOrder?.items || []);

    // Calculate subtotal, delivery charge, discount and total amount
    const sanitizedItems = (rawItems || []).map((item: any) => ({
      productId: item.productId || 'UNKNOWN-PROD',
      name: item.name || 'Grocery Item',
      altNameGujarati: item.altNameGujarati || '',
      unit: item.unit || '1 kg',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || '',
    }));

    const subtotal = sanitizedItems.reduce((acc: number, item: any) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0);

    const deliveryCharge =
      Number(clientDeliveryCharge) ?? draftOrder?.deliveryCharge ?? Number(weightSummary?.shippingFee) ?? 0;
    const discountAmount = Number(clientDiscountAmount) ?? draftOrder?.discountAmount ?? 0;
    const finalCouponCode = couponCode || draftOrder?.couponCode || '';
    const totalAmount = Math.max(0, subtotal + deliveryCharge - discountAmount);

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `MXF-${randomNum}`;

    const newOrder = await Order.create({
      orderId,
      customerDetails: {
        name: customerDetails?.name || draftOrder?.customerDetails?.name || 'Moxfood Customer',
        phone: customerDetails?.phone || draftOrder?.customerDetails?.phone || '',
        address: customerDetails?.address || draftOrder?.customerDetails?.address || '',
        pincode: customerDetails?.pincode || draftOrder?.customerDetails?.pincode || '',
        landmark: customerDetails?.landmark || draftOrder?.customerDetails?.landmark || '',
        deliverySlot: 'Anytime Today',
      },
      items: sanitizedItems,
      subtotal,
      deliveryCharge,
      couponCode: finalCouponCode,
      discountAmount,
      totalAmount,
      paymentMethod: 'RAZORPAY',
      paymentStatus: isSignatureValid || razorpay_payment_id ? 'Paid' : 'Pending',
      status: 'Pending',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || '',
      notes: notes || '',
    });

    if (draftOrder) {
      await DraftOrder.findByIdAndUpdate(draftOrder._id, { status: 'Converted', paymentStatus: 'Paid' });
    }

    // Stock update for ordered products
    for (const item of sanitizedItems) {
      if (item.productId) {
        try {
          const rawId = String(item.productId).split('_')[0];
          await Product.findByIdAndUpdate(rawId, {
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
