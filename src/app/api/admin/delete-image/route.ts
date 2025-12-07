import { environmentVariables } from '@/config/environment';
import { requireAdmin } from '@/lib/adminMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/event';
import Image from '@/models/image';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const deleteImage = async (uuid: string) => {
  const image = await Image.findOne({ uuid });
  const event = await Event.findById(image.event);

  await Image.deleteOne({ uuid });

  // rename image in uploads folder
  const fileExtension = image.extension;
  const filePath = path.join(
    environmentVariables.UPLOAD_FOLDER,
    event._id.toString(),
    `${image.uuid}${fileExtension}`,
  );

  await fs.rm(filePath);

  // try to delete _orig file as well
  try {
    await fs.rm(
      path.join(
        environmentVariables.UPLOAD_FOLDER,
        event._id.toString(),
        `${image.uuid}_orig${fileExtension}`,
      ),
    );
  } catch {}
};

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const authCheck = requireAdmin(req);
  if (!authCheck) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

  const { uuid } = await req.json();
  if (!uuid) return NextResponse.json({ error: 'Fehlende UUID' }, { status: 400 });

  await deleteImage(uuid);

  return NextResponse.json({ message: 'Bild gelöscht' });
}

export const dynamic = 'force-dynamic';
