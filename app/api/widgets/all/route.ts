import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Campaign from '@/models/Campaign';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const apiKey = searchParams.get('key');

    if (!apiKey) return NextResponse.json({ error: 'API key required' }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ apiKey });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Filter only enabled widgets
    const enabledWidgets: any = {};
    if (user.widgets) {
      Object.keys(user.widgets).forEach(key => {
        if (user.widgets[key]?.enabled) {
          enabledWidgets[key] = user.widgets[key];
        }
      });
    }

    // 2. Fetch Active Campaigns
    const now = new Date();
    const activeCampaigns = await Campaign.find({
        userId: user._id,
        status: 'active',
        startTime: { $lte: now },
        endTime: { $gte: now }
    });

    const response = NextResponse.json({ 
        widgets: enabledWidgets,
        campaigns: activeCampaigns
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
