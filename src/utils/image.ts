import { environmentVariables } from '@/config/environment';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/event';
import fs from 'fs/promises';
import { ObjectId } from 'mongoose';
import path from 'path';
import sharp from 'sharp';

export const putLogoOntoBuffer = async (buffer: Buffer, eventId: ObjectId) => {
  try {
    await connectToDatabase();

    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    const logo = event.logo;
    const logoFile = path.join(environmentVariables.UPLOAD_FOLDER, 'logos', logo);

    // Read logo file
    const logoBuffer = await fs.readFile(logoFile);

    // Load main image (buffer)
    const mainImage = sharp(buffer);

    // Composite logo onto bottom-right
    const resultBuffer = await mainImage
      .composite([
        {
          input: logoBuffer,
          gravity: 'southeast', // bottom-right corner
        },
      ])
      .toBuffer();

    return resultBuffer;
  } catch {
    // in case anything goes wrong, just return the original image
    return buffer;
  }
};
