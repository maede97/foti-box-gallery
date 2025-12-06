import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/event';
import React from 'react';
import { ErrorPage } from '../pages/error';
import ImageUploadClient from '../pages/upload-page-client';

export const generateMetadata = async () => {
  return {
    title: 'Hochladen | foti-box.com',
    description: 'Lade deine Bilder in die foti-box.com Galerie hoch.',
  };
};

const ImageUpload: React.FC = async () => {
  await connectToDatabase();

  const event = await Event.findOne({ allow_user_uploads: true, active: true });

  if (!event) {
    return <ErrorPage message={'Uploads sind derzeit nicht möglich.'} />;
  }

  return <ImageUploadClient />;
};

export default ImageUpload;

export const dynamic = 'force-dynamic';
