import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/models/Campaign';
import { verifyToken, getAuthToken } from '@/lib/auth';

async function getUserIdFromToken() {
  const token = getAuthToken();
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId as string;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
        const campaign = await Campaign.findOne({ _id: id, userId });
        return NextResponse.json({ campaign });
    }

    const campaigns = await Campaign.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ campaigns });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    if (body._id) {
      // Update
      const campaign = await Campaign.findOneAndUpdate(
        { _id: body._id, userId },
        { ...body, updatedAt: new Date() },
        { new: true }
      );
      return NextResponse.json({ success: true, campaign });
    } else {
      // Create
      const campaign = await Campaign.create({
        ...body,
        userId
      });
      return NextResponse.json({ success: true, campaign });
    }
  } catch (error) {
    console.error('Campaign Save Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await Campaign.deleteOne({ _id: id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
