import { environmentVariables } from '@/config/environment';
import { connectToDatabase } from '@/lib/mongodb';
import Box from '@/models/box';
import Event from '@/models/event';
import Image from '@/models/image';
import fs from 'fs/promises';
import { ObjectId } from 'mongoose';
import { NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uploadFile = async (file: File, eventId: ObjectId) => {
  await connectToDatabase();

  // Generate a unique filename
  const fileExtension = path.extname(file.name) || '.jpg'; // default to .jpg if missing
  const fileUuid = uuidv4();
  const fileName = `${fileUuid}${fileExtension}`;

  // Create uploads folder for the event
  const uploadDir = path.join(environmentVariables.UPLOAD_FOLDER, eventId.toString());
  await fs.mkdir(uploadDir, { recursive: true });

  // Save file to filesystem
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  // Save metadata to database
  const image = new Image({
    uuid: fileUuid,
    extension: fileExtension,
    event: eventId,
  });

  await image.save();

  return fileUuid;
};

export async function PUT(req: Request) {
  await connectToDatabase();

  const event = await Event.findOne({ active: true });
  if (!event) {
    return NextResponse.json({ error: 'No active event found' }, { status: 400 });
  }

  // check if event allows user uploads
  if (!event.allow_user_uploads) {
    return NextResponse.json(
      { error: 'Es können keine Fotos hochgeladen werden.' },
      { status: 400 },
    );
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  const fileUuid = await uploadFile(file, event._id);

  return NextResponse.json({ uuid: fileUuid });
}

export async function POST(req: Request) {
  await connectToDatabase();

  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // check if api key is valid by selecting a box from the DB
  const box = await Box.findOne({ accessToken: apiKey, active: true });
  if (!box) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // update lastUpload timestamp
  box.lastUpload = new Date();
  await box.save();

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  // Get active event
  const event = await Event.findOne({ active: true });
  if (!event) {
    return NextResponse.json({ error: 'No active event found' }, { status: 400 });
  }

  const fileUuid = await uploadFile(file, event._id);

  return NextResponse.json({ uuid: fileUuid });
}

export const dynamic = 'force-dynamic';
