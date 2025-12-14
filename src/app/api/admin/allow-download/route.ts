import { requireAdmin } from '@/lib/adminMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/event';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

  const { eventId, allow_download } = await req.json();
  if (!eventId) return NextResponse.json({ error: 'Fehlende Event ID' }, { status: 400 });

  const event = await Event.findByIdAndUpdate(
    eventId,
    { allow_download: allow_download },
    { new: true },
  );
  if (!event) return NextResponse.json({ error: 'Event nicht gefunden' }, { status: 404 });

  return NextResponse.json({
    message: `Der Event "${event.name}" erlaubt nun ${allow_download ? '' : 'keine '}Downloads`,
    event,
  });
}

export const dynamic = 'force-dynamic';
