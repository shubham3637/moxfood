import { NextResponse } from 'next/server';
import { trackShadowfaxOrder } from '@/lib/shadowfax';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const awb = searchParams.get('awb') || searchParams.get('orderId');

    if (!awb) {
      return NextResponse.json(
        { success: false, error: 'awb or orderId query parameter is required' },
        { status: 400 }
      );
    }

    const trackingResult = await trackShadowfaxOrder(awb);
    return NextResponse.json(trackingResult);
  } catch (error: any) {
    console.error('Shadowfax Track Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Shadowfax tracking info' },
      { status: 500 }
    );
  }
}
