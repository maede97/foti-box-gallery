'use client';
import GalleryDisplay from '@/components/gallery/display';
import { fetchGallery } from '@/components/gallery/fetch';
import GalleryLogin from '@/components/gallery/login';
import React, { useState, useEffect } from 'react';

const EventPageClient: React.FC<{
  eventName: string;
  eventSlug: string;
  doesNotRequirePassword: boolean;
}> = ({ eventName, eventSlug, doesNotRequirePassword }) => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(doesNotRequirePassword);

  useEffect(() => {
    if (doesNotRequirePassword) {
      void fetchGallery(eventSlug, '', setError, setImages, setLoggedIn);
    }
  }, [doesNotRequirePassword, eventSlug]);

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

export default EventPageClient;
