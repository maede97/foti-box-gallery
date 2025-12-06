import { ErrorPage } from '@/pages/error';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const GalleryDisplay: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);

  const openGallery = useCallback((index: number) => setCurrentIndex(index), []);
  const closeGallery = useCallback(() => setCurrentIndex(null), []);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev! + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowLeft') prevImage();
      if (event.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeGallery, prevImage, nextImage]);

  if (images.length === 0) {
    return <ErrorPage message={'Keine Fotos in dieser Galerie.'} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
      <h1 className="text-secondary mb-6 text-center text-2xl font-semibold tracking-wide uppercase">
        {title || 'Galerie'}
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((uuid, index) => (
          <div
            key={uuid}
            className="relative aspect-16/9 cursor-pointer overflow-hidden bg-neutral-100"
            onClick={() => openGallery(index)}
          >
            <Image
              src={`/api/gallery?uuid=${uuid}`}
              alt="Photo"
              fill
              className="bg-primary object-contain"
            />
          </div>
        ))}
      </div>

      <AnimatePresence custom={direction}>
        {currentIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="text-primary bg-secondary hover:bg-accent absolute top-4 right-4 z-100 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-xl"
              onClick={closeGallery}
            >
              &times;
            </button>

            <button
              className="text-primary bg-secondary hover:bg-accent absolute left-4 z-100 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-xl"
              onClick={prevImage}
            >
              &#8249;
            </button>

            <button
              className="text-primary bg-secondary hover:bg-accent absolute right-4 z-100 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-xl"
              onClick={nextImage}
            >
              &#8250;
            </button>

            <div
              className="bg-primary/80 fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={closeGallery}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image itself
                key={images[currentIndex]}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({
                    x: dir > 0 ? 300 : -300,
                    opacity: 0,
                  }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir: number) => ({
                    x: dir < 0 ? 300 : -300,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.3 }}
                className="relative flex h-full max-h-[90%] w-full max-w-[90%] items-center justify-center"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={`/api/gallery?uuid=${images[currentIndex]}`}
                    alt="Photo"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryDisplay;
