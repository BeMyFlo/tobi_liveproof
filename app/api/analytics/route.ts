import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, widgetType, eventType, metadata } = await req.json();

    if (!apiKey || !widgetType || !eventType) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ apiKey });
    if (!user) return NextResponse.json({ error: 'Invalid API Key' }, { status: 404 });

    await Event.create({
      userId: user._id,
      apiKey,
      widgetType,
      eventType,
      metadata
    });

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
