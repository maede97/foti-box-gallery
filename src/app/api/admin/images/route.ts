import { requireAdmin } from '@/lib/adminMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import Image from '@/models/image';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

  const images = await Image.find({}).sort({ createdAt: -1 });
  return NextResponse.json(images);
}

export const dynamic = 'force-dynamic';
