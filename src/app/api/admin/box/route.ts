import { requireAdmin } from '@/lib/adminMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import Box from '@/models/box';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const boxes = await Box.find({}).sort({ createdAt: -1 });
  return NextResponse.json(boxes);
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { boxID } = await req.json();

  // delete box
  await Box.findByIdAndDelete(boxID);

  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { label, accessToken } = await req.json();
  if (!label || !accessToken)
    return NextResponse.json({ error: 'Missing label or accessToken' }, { status: 400 });

  const box = new Box({ label, accessToken, active: true });
  await box.save();

  return NextResponse.json({ message: 'Box created', box });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { boxID, active } = await req.json();
  if (active === undefined)
    return NextResponse.json({ error: 'Missing active status' }, { status: 400 });

  const box = await Box.findById(boxID);
  if (!box) return NextResponse.json({ error: 'Box not found' }, { status: 404 });

  box.active = active;
  await box.save();

  return NextResponse.json({ message: 'Box updated', box });
}

export const dynamic = 'force-dynamic';
