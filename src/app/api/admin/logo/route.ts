import { environmentVariables } from '@/config/environment';
import { requireAdmin } from '@/lib/adminMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/event';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const logo = searchParams.get('logo');
  const eventId = searchParams.get('eventId');
  if (!logo || !eventId) return NextResponse.json({ error: 'Falsche Daten' }, { status: 404 });

  // check event for containing this logo
  const event = await Event.findById(eventId);

  if (event.logo !== logo) {
    return NextResponse.json({ error: 'Falsches Bild' }, { status: 404 });
  }

  // read logo from disk
  const logoFileBuffer = await fs.readFile(
    path.join(environmentVariables.UPLOAD_FOLDER, 'logos', logo),
  );

  return new Response(logoFileBuffer, {
    status: 200,
    headers: {
      'Content-Length': logoFileBuffer.length.toString(),
      'Content-Disposition': `attachment; filename="${logo}"`,
    },
  });
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

  const { eventId } = await req.json();

  if (!eventId) return NextResponse.json({ error: 'Falsche Daten' }, { status: 404 });

  const event = await Event.findByIdAndUpdate(eventId, { logo: '' });
  if (!event) return NextResponse.json({ error: 'Event nicht gefunden' }, { status: 404 });

  return NextResponse.json({
    message: `Der Event "${event.name}" hat nun kein Logo mehr.`,
    event,
  });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const eventId = formData.get('eventId') as string;

  const event = await Event.findById(eventId);
  if (!event) {
    return NextResponse.json({ error: 'Kein aktiver Event gefunden' }, { status: 400 });
  }

  const uploadDir = path.join(environmentVariables.UPLOAD_FOLDER, 'logos');
  await fs.mkdir(uploadDir, { recursive: true });

  // save logo to disk
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(path.join(uploadDir, file.name), buffer);

  event.logo = file.name;
  await event.save();

  return NextResponse.json({
    logo: file.name,
  });
}

export const dynamic = 'force-dynamic';
