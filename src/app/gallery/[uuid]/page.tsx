'use client';
import { LoadingSpinner } from '@/components/ui/loading';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ParamsType {
  uuid: string;
}
const GalleryPage: React.FC<{ params: React.Usable<ParamsType> }> = ({ params }) => {
  const { uuid } = React.use<ParamsType>(params);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="absolute flex size-full items-center justify-center">
        <LoadingSpinner color={'stone-200'} />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Image
          src={`/api/gallery?uuid=${uuid}`}
          alt="Photo"
          fill
          className="bg-stone-900 object-contain"
        />
      </motion.div>
    </div>
  );
};

export default GalleryPage;
