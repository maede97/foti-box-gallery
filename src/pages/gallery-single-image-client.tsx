'use client';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const GallerySingleImageClient: React.FC<{ uuid: string; allowDownload: boolean }> = ({
  uuid,
  allowDownload,
}) => {
  const handleDownloadButton = () => {
    window.open(`/api/gallery?uuid=${uuid}`);
  };

  return (
    <div className="m-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative min-h-[80vh] w-full">
          <Image
            src={`/api/gallery?uuid=${uuid}`}
            alt="foti-box.com"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="bg-primary object-contain"
            priority
          />
        </div>
        {allowDownload && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDownloadButton}
              className="bg-secondary text-primary inline-flex cursor-pointer gap-2 rounded px-4 py-2 text-white"
            >
              <Download /> Bild Herunterladen
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GallerySingleImageClient;
