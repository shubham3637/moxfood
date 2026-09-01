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
    const {
      paymentId,
      customerDetails: manualDetails,
      items: manualItems,
      forceUpdate = false,
    } = body;

    if (!paymentId || !paymentId.startsWith('pay_')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Razorpay Payment ID (e.g. pay_TWkcm7opthXGYz)' },
        { status: 400 }
      );
    }

    // 1. Initialize Razorpay API client
    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    let payment: any = null;
    let orderNotes: any = {};

    try {
      payment = await instance.payments.fetch(paymentId);
      if (payment && payment.order_id) {
        try {
          const rzpOrder = await instance.orders.fetch(payment.order_id);
          orderNotes = rzpOrder.notes || {};
        } catch (oErr) {
          console.warn('Could not fetch Razorpay order notes:', oErr);
        }
      }
    } catch (pErr: any) {
      console.warn('Razorpay payment fetch error:', pErr);
    }

    // Combine notes from Razorpay order and payment object
    const notes = {
      ...(orderNotes || {}),
      ...((payment && payment.notes) || {}),
    };

    const totalAmount = payment ? Number(payment.amount) / 100 : Number(body.totalAmount) || 0;

    // Extract customer details with priority: manual input > notes > payment object > fallback defaults
    const name =
      manualDetails?.name?.trim() ||
      notes.customerName ||
      notes.name ||
      payment?.email?.split('@')[0] ||
      'Moxfood Customer';

    const phone =
      manualDetails?.phone?.trim() ||
      notes.customerPhone ||
      notes.phone ||
      (payment?.contact ? String(payment.contact).replace(/^\+91/, '') : '');

    const address =
      manualDetails?.address?.trim() ||
      notes.customerAddress ||
      notes.address ||
      'Address provided during Payment';

    const pincode =
      manualDetails?.pincode?.trim() ||
      notes.customerPincode ||
      notes.pincode ||
      '395006';

    const landmark =
      manualDetails?.landmark?.trim() ||
      notes.landmark ||
      '';

    const items =
      manualItems && manualItems.length > 0
        ? manualItems
        : [
            {
              productId: 'REC-ITEM-101',
              name: notes.itemsSummary || 'Moxfood Healthy Seed Order (Synced)',
              unit: '1 kg',
              price: totalAmount > 0 ? totalAmount : 100,
              quantity: 1,
              image: '/logo.png',
            },
          ];

    // Check if order already exists in database
    let existingOrder = await Order.findOne({
      $or: [{ razorpayPaymentId: paymentId }],
    });

    if (existingOrder) {
      if (forceUpdate || manualDetails) {
        // Re-sync and update existing order with full details
        existingOrder.customerDetails = {
          name: name || existingOrder.customerDetails.name,
          phone: phone || existingOrder.customerDetails.phone,
          address: address || existingOrder.customerDetails.address,
          pincode: pincode || existingOrder.customerDetails.pincode,
          landmark: landmark || existingOrder.customerDetails.landmark,
          deliverySlot: 'Anytime Today',
        };

        if (manualItems && manualItems.length > 0) {
          existingOrder.items = manualItems;
        }

        if (totalAmount > 0) {
          existingOrder.totalAmount = totalAmount;
          existingOrder.subtotal = totalAmount;
        }

        existingOrder.paymentStatus = 'Paid';
        await existingOrder.save();

        // Push update to Shipmozo if needed
        try {
          await pushOrderToShipmozo(existingOrder);
        } catch (e) {
          console.warn('Shipmozo update failed:', e);
        }

        return NextResponse.json({
          success: true,
          message: `Order #${existingOrder.orderId} successfully re-synced and updated with full details!`,
          order: existingOrder,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Order #${existingOrder.orderId} already exists in database.`,
        order: existingOrder,
      });
    }

    // Create new order if not existing
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `MXF-${randomNum}`;

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
      subtotal: totalAmount,
      deliveryCharge: 0,
      couponCode: '',
      discountAmount: 0,
      totalAmount,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'Paid',
      status: 'Pending',
      razorpayOrderId: String(payment?.order_id || ''),
      razorpayPaymentId: paymentId,
      razorpaySignature: 'RECOVERED_VIA_ADMIN',
      notes: `Synced Payment ID: ${paymentId}. Bank RRN: ${payment?.acquirer_data?.rrn || payment?.vpa || 'N/A'}`,
    });

    // Auto-push to Shipmozo
    try {
      await pushOrderToShipmozo(newOrder);
    } catch (e) {
      console.warn('Shipmozo push warning during order sync:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Order #${newOrder.orderId} successfully synced & created for Payment ID ${paymentId}!`,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Error syncing Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync Razorpay order' },
      { status: 500 }
    );
  }
}
