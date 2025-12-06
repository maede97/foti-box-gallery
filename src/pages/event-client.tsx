'use client';
import GalleryDisplay from '@/components/gallery/display';
import { fetchGallery } from '@/components/gallery/fetch';
import GalleryLogin from '@/components/gallery/login';
import React, { useState } from 'react';

export const EventPageClient: React.FC<{ eventName: string; eventSlug: string }> = ({
  eventName,
  eventSlug,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="m-6">
      {!loggedIn && (
        <GalleryLogin
          fetchGallery={(selectedEvents, passwords) =>
            fetchGallery(selectedEvents, passwords, setError, setImages, setLoggedIn)
          }
          error={error}
          selectedEvent={eventSlug}
        />
      )}
      {loggedIn && <GalleryDisplay images={images} title={eventName} />}{' '}
    </div>
  );
};
