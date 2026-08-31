import { NextResponse } from 'next/server';
import { trackShipmozoOrder } from '@/lib/shipmozo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const awbNumber = searchParams.get('awb');

    if (!awbNumber) {
      return NextResponse.json({ success: false, error: 'awb parameter is required' }, { status: 400 });
    }

    const trackRes = await trackShipmozoOrder(awbNumber);
    return NextResponse.json(trackRes);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
