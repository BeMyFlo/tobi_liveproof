import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Migration for new widget types
    let needsSave = false;
    if (!user.widgets) {
        user.widgets = {};
        needsSave = true;
    }
    if (!user.widgets.welcome) {
        user.widgets.welcome = { enabled: false, template: 'Chào mừng bạn quay lại! Rất vui được gặp lại bạn.', delay: 2000, hideAfter: 8000 };
        needsSave = true;
    }
    if (!user.widgets.loyalty) {
        user.widgets.loyalty = { enabled: false, template: 'Chương trình Loyalty' };
        needsSave = true;
    }

    if (needsSave) {
        user.markModified('widgets');
        await user.save();
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
