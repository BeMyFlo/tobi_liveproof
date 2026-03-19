import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await dbConnect();
    
    const views = await Event.countDocuments({ userId: decoded.userId, eventType: 'view' });
    const clicks = await Event.countDocuments({ userId: decoded.userId, eventType: 'click' });
    
    // Last 7 days chart data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      
      const count = await Event.countDocuments({
        userId: decoded.userId,
        createdAt: { $gte: start, $lte: end }
      });
      last7Days.push(count);
    }

    return NextResponse.json({ 
      views, 
      clicks, 
      conversion: views > 0 ? ((clicks / views) * 100).toFixed(1) : 0,
      chart: last7Days
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
