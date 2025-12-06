import { connectToDatabase } from '@/lib/mongodb';
import image from '@/models/image';
import { GallerySingleImageClient } from '@/pages/gallery-single-image-client';
import { notFound } from 'next/navigation';
import React from 'react';

interface ParamsType {
  uuid: string;
}
const GalleryPage: React.FC<{ params: ParamsType }> = async ({ params }) => {
  await connectToDatabase();

  const { uuid } = await params;

  // Verification that the image exists
  const dbImage = await image.findOne({ uuid: uuid });

  if (!dbImage) {
    notFound();
  }

  return (
    <div className="m-6">
      <GallerySingleImageClient uuid={uuid} />
    </div>
  );
};

export default GalleryPage;
