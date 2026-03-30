import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { widgets, seoEnabled, seoKeywords, allowedDomains } = await req.json();

    await dbConnect();
    
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (widgets) {
      user.widgets = widgets;
      user.markModified('widgets');
    }

    if (seoEnabled !== undefined) user.seoEnabled = seoEnabled;
    if (seoKeywords !== undefined) user.seoKeywords = seoKeywords;
    if (allowedDomains !== undefined) user.allowedDomains = allowedDomains;
    
    const savedUser = await user.save();
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
