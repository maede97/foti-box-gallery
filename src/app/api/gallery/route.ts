import { environmentVariables } from '@/config/environment';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/event';
import Image from '@/models/image';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  const { slug, password } = await req.json();

  if (!slug || !password)
    return NextResponse.json({ error: 'Missing slug or password' }, { status: 400 });

  await connectToDatabase();

  const event = await Event.findOne({ slug: slug });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  if (event.password !== password)
    return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 });

  const images = await Image.find({ event: event._id }).sort({ createdAt: -1 });

  return NextResponse.json(images);
}

export async function GET(req: Request) {
  await connectToDatabase();

  // Extract UUID from query string
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get('uuid');

  if (!uuid) {
    return NextResponse.json({ error: 'Missing uuid' }, { status: 400 });
  }

  // Fetch image metadata from MongoDB
  const image = await Image.findOne({ uuid });

  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const event = await Event.findById(image.event);
  if (!event) {
    return NextResponse.json({ error: 'Associated event not found' }, { status: 404 });
  }

  try {
    // Read file from disk
    const fileExtension = image.extension;
    const fileName = `${image.uuid}${fileExtension}`;
    const filePath = path.join(environmentVariables.UPLOAD_FOLDER, event._id.toString(), fileName);
    const fileBuffer = await fs.readFile(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': image.mimetype || 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString(),
        'Content-Disposition': `attachment; filename="${image.uuid}.${image.extension}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read image file' + err }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
