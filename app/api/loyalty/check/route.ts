import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Purchase from '@/models/Purchase';
import LoyaltyMilestone from '@/models/LoyaltyMilestone';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get('apiKey');
    const email = searchParams.get('email');
    const coupon = searchParams.get('coupon');

    if (!apiKey || !email || !coupon) {
      return NextResponse.json({ error: 'Missing parameters. Need: apiKey, email, coupon' }, { status: 400 });
    }

    await dbConnect();

    // 1. Find the store owner
    const user = await User.findOne({ apiKey });
    if (!user) return NextResponse.json({ error: 'Invalid API Key' }, { status: 404 });

    // 2. Count purchases for this customer at this store
    const purchaseCount = await Purchase.countDocuments({
      userId: user._id,
      customerEmail: email
    });

    // 3. Find the milestone for this coupon
    const milestone = await LoyaltyMilestone.findOne({
      userId: user._id,
      couponCode: coupon
    });

    if (!milestone) {
      return NextResponse.json({ 
        success: false, 
        eligible: false, 
        reason: 'Coupon not found in loyalty program' 
      });
    }

    // 4. Check eligibility
    const isEligible = purchaseCount >= milestone.threshold;

    return NextResponse.json({
      success: true,
      eligible: isEligible,
      currentOrders: purchaseCount,
      requiredOrders: milestone.threshold,
      customerEmail: email,
      couponCode: coupon
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Loyalty Check Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
