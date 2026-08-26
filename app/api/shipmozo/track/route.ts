import { NextResponse } from 'next/server';
import { trackShipmozoOrder } from '@/lib/shipmozo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const awb = searchParams.get('awb');

    if (!awb) {
      return NextResponse.json({ success: false, error: 'AWB number is required' }, { status: 400 });
    }

    const data = await trackShipmozoOrder(awb);
    return NextResponse.json({ success: true, tracking: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
