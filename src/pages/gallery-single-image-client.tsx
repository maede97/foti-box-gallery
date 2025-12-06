'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export const GallerySingleImageClient: React.FC<{ uuid: string }> = ({ uuid }) => {
  return (
    <div className="m-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Image
          src={`/api/gallery?uuid=${uuid}`}
          alt="Photo"
          fill
          className="bg-primary object-contain"
        />
      </motion.div>
    </div>
  );
};
