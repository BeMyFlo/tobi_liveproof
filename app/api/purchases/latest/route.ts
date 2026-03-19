import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Purchase from '@/models/Purchase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

    await dbConnect();
    // Get last 10 purchases
    const purchases = await Purchase.find({ apiKey: key })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ purchases }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
