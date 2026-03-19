import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-sepay-signature'); // Some gateways use headers
    
    // SePay Webhook Payload structure example:
    // {
    //   "id": 12345,
    //   "gateway": "vietcombank",
    //   "amount_in": 79000,
    //   "code": "LP_123456", -> This is our memo/orderCode
    //   "transaction_content": "LP_123456 ..."
    // }

    // --- 1. Basic Verification ---
    // (Note: If SePay sends a secret token in the body, verify it here)
    // For now, we use the 'code' to match our record. 
    // In production, we SHOULD verify the signature from SePay.
    
    const { code, amount_in } = body;
    if (!code) return NextResponse.json({ success: false, message: 'Missing code' }, { status: 400 });

    await dbConnect();

    // 2. Find the pending payment
    // We try to match either from the strict 'code' field or the 'transaction_content'
    const payment = await Payment.findOne({ 
      memo: code,
      status: 'PENDING'
    });

    if (!payment) {
        // Fallback: search in transaction content if code is missing but memo is in content
        console.log(`Payment not found with code: ${code}. Checking transaction_content...`);
        return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
    }

    // 3. Verify Amount
    if (amount_in < payment.amount) {
        return NextResponse.json({ success: false, message: 'Insufficient amount' }, { status: 400 });
    }

    // 4. Upgrade the User
    const user = await User.findById(payment.userId);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    user.plan = payment.plan;
    await user.save();

    // 5. Mark Payment as PAID
    payment.status = 'PAID';
    payment.paymentLinkId = body.id; // Store SePay transaction ID
    await payment.save();

    console.log(`Successfully upgraded user ${user.email} to ${payment.plan} via SePay.`);

    return NextResponse.json({ success: true, message: 'Payment processed successfully' });

  } catch (error) {
    console.error('SePay Webhook Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Support OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-SePay-Signature'
    }
  });
}
