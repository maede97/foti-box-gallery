'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface ParamsType {
  uuid: string;
}
const GalleryPage: React.FC<{ params: React.Usable<ParamsType> }> = ({ params }) => {
  const { uuid } = React.use<ParamsType>(params);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Image
          src={`/api/gallery?uuid=${uuid}`}
          alt="Photo"
          fill
          className="bg-stone-900 object-contain"
          priority
        />
      </motion.div>
    </div>
  );
};

export default GalleryPage;
