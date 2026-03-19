import { NextRequest, NextResponse } from 'next/server';
import { SePayPgClient } from 'sepay-pg-node';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { decode } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Simple decode since we trust our cookie
    const decoded: any = decode(token);
    if (!decoded || !decoded.userId) return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });

    const amountMap: any = {
      'pro': 79000,
      'premium': 199000
    };

    const amount = amountMap[plan];
    if (!amount) return NextResponse.json({ error: 'Invalid Plan' }, { status: 400 });

    await dbConnect();
    
    // Generate a unique order code and memo
    const orderCode = `LP_${Math.floor(Math.random() * 9000000) + 1000000}`;
    const memo = orderCode; // Use order code as bank memo for easy tracking

    // 1. Create a Payment record in our DB
    const payment = await Payment.create({
      userId: decoded.userId,
      amount,
      plan,
      orderCode,
      memo,
      status: 'PENDING'
    });

    // 2. Initialize SePay client
    const client = new SePayPgClient({
      env: 'sandbox', // Use 'production' for live
      merchant_id: process.env.SEPAY_MERCHANT_ID || '',
      secret_key: process.env.SEPAY_SECRET_KEY || ''
    });

    const checkoutURL = client.checkout.initCheckoutUrl();
    const checkoutFormfields = client.checkout.initOneTimePaymentFields({
      payment_method: 'BANK_TRANSFER',
      order_invoice_number: orderCode,
      order_amount: amount,
      currency: 'VND',
      order_description: `Upgrade LiveProof to ${plan.toUpperCase()}`,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      error_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=cancel`,
    });

    return NextResponse.json({ 
      success: true,
      checkoutURL,
      fields: checkoutFormfields,
      orderCode
    });

  } catch (error) {
    console.error('SePay Init Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
