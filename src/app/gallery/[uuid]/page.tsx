import Footer from '@/components/ui/footer';
import { connectToDatabase } from '@/lib/mongodb';
import event from '@/models/event';
import image from '@/models/image';
import GallerySingleImageClient from '@/pages/gallery-single-image-client';
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

  // check if the accompanying event allows for downloads
  const imageEvent = await event.findById(dbImage.event);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="m-6 flex-1">
        <GallerySingleImageClient uuid={uuid} allowDownload={imageEvent.allow_download} />
      </main>

      <Footer />
    </div>
  );
};

export default GalleryPage;
