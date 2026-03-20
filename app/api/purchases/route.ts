import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Purchase from '@/models/Purchase';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, product, location, customerName, customerEmail } = await req.json();

    if (!apiKey || !product) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ apiKey });
    if (!user) return NextResponse.json({ error: 'Invalid API Key' }, { status: 404 });

    // Save to Database
    const newPurchase = await Purchase.create({
      userId: user._id,
      apiKey,
      productName: product,
      customerLocation: location || 'Someone',
      customerName: customerName || 'Someone',
      customerEmail: customerEmail
    });
    
    console.log(`Real purchase recorded for ${user.email}: ${product}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Purchase registered and saved',
      data: newPurchase 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Purchase ingestion error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
