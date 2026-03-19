import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Payment from '@/models/Payment';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  console.log('--- SEPAY WEBHOOK: Incoming Request ---');
  try {
    const body = await req.json();
    console.log('SePay Payload:', JSON.stringify(body, null, 2));

    const signature = req.headers.get('x-sepay-signature');
    
    // SePay Webhook Payload structure can vary. Handling both direct and nested formats:
    const code = body.code || body.order?.order_invoice_number;
    const amount_in = body.amount_in || body.transaction?.transaction_amount;
    const transaction_content = body.transaction_content || body.order?.order_description;

    console.log(`Extracted Code: ${code}, Amount: ${amount_in}`);

    if (!code && !transaction_content) return NextResponse.json({ success: false, message: 'Missing transaction data' }, { status: 400 });

    await dbConnect();

    // 2. Find the pending payment - Try strict code first, then search in content
    let payment = await Payment.findOne({ 
      memo: code,
      status: 'PENDING'
    });

    if (!payment && transaction_content) {
      // Fallback: search for our LP_ pattern in content
      const match = transaction_content.match(/LP_\d+/);
      if (match) {
        payment = await Payment.findOne({ 
          memo: match[0],
          status: 'PENDING'
        });
      }
    }

    if (!payment) {
        console.log(`Payment not found. Incoming Code: ${code}, Content: ${transaction_content}`);
        return NextResponse.json({ success: false, message: 'Payment record not found or already processed' }, { status: 404 });
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
    payment.paymentLinkId = body.transaction?.id || body.transaction?.transaction_id || body.id; 
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
