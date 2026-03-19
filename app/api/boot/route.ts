import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const widgetType = searchParams.get('widget') || 'viewers';

    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ apiKey: key });
    if (!user) return NextResponse.json({ error: 'Invalid key' }, { status: 404 });

    // Map dash-case from URL to camelCase in Database
    const keyMap: any = {
      'exit-intent': 'exitIntent',
      'viewers': 'viewers',
      'purchases': 'purchases'
    };
    
    const dbKey = keyMap[widgetType] || widgetType;
    const settings = user.widgets[dbKey] || {};

    return NextResponse.json({ 
      settings,
      plan: user.plan
    }, {
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
