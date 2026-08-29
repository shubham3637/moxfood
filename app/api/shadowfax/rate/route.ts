import { NextResponse } from 'next/server';
import { checkShadowfaxRate } from '@/lib/shadowfax';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode') || '';
    const weightGrams = Number(searchParams.get('weight')) || 500;

    if (!pincode || pincode.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: '6-digit pincode is required' },
        { status: 400 }
      );
    }

    const rateResult = await checkShadowfaxRate(pincode.trim(), weightGrams);

    return NextResponse.json({
      success: true,
      ...rateResult,
    });
  } catch (error: any) {
    console.error('Shadowfax Rate Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate shipping rate' },
      { status: 500 }
    );
  }
}
