import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Visitor from '@/models/Visitor';

export async function POST(req: NextRequest) {
  try {
    const { key, visitorId, url } = await req.json();

    if (!key || !visitorId) {
      return NextResponse.json({ error: 'Missing information' }, { status: 400 });
    }

    await dbConnect();

    // 1. Find the site owner
    const user = await User.findOne({ apiKey: key });
    if (!user) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 404 });
    }

    // 2. Track the visitor
    let visitor = await Visitor.findOne({ visitorId, userId: user._id });
    let specialTrigger = null;
    let isReturning = false;

    if (visitor) {
      isReturning = true;
      const now = new Date();
      const lastVisit = new Date(visitor.lastVisit);
      const diffDays = Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 3600 * 24));

      // Check if it's been more than 30 days
      if (diffDays >= 30) {
        specialTrigger = 'LONG_TIME_NO_SEE';
      }

      // Update visitor info
      visitor.lastVisit = now;
      visitor.visitCount += 1;
      
      // Update recent pages (keep last 5)
      if (url) {
        visitor.recentPages.unshift(url);
        visitor.recentPages = visitor.recentPages.slice(0, 5);
      }
      
      await visitor.save();
    } else {
      // New visitor
      isReturning = false;
      visitor = await Visitor.create({
        visitorId,
        userId: user._id,
        recentPages: url ? [url] : [],
        metadata: {
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      });
    }

    console.log(`Visitor ${visitorId}: isReturning=${isReturning}, trigger=${specialTrigger}`);

    return NextResponse.json({ 
      success: true, 
      specialTrigger,
      isReturning
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Track Visitor Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
