'use client';
import { LoadingSpinner } from '@/components/ui/loading';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Bitte eine gültige Bilddatei auswählen.');
      setSelectedFile(undefined);
      setPreviewUrl(undefined);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleUpload = async () => {
    setIsUploading(true);

    if (!selectedFile) {
      setError('Bitte zuerst eine Datei auswählen.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await fetch('/api/upload', {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw Error(data.error || 'Upload fehlgeschlagen.');
      }

      setError('');
      setMessage('Vielen Dank!');
      setSelectedFile(undefined);
      setPreviewUrl(undefined);
      setHasUploaded(true);
      setIsUploading(false);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="absolute flex size-full items-center justify-center">
        <LoadingSpinner color={'secondary'} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary m-6 mx-auto max-w-xl p-6"
    >
      <h2 className="text-primary mb-6 text-lg font-semibold tracking-wide uppercase">
        Bild hochladen
      </h2>

      {error && <p className="p-2 text-center text-sm text-orange-600">{error}</p>}
      {message && <p className="text-primary p-2 text-center text-sm">{message}</p>}

      {isUploading && (
        <div className="text-primary text-center">
          <LoadingSpinner color={'primary'} />
          Lade hoch...
        </div>
      )}

      {!hasUploaded && !isUploading && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-primary text-xs tracking-wide uppercase">Bild auswählen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-primary text-secondary w-full border p-2 text-sm focus:outline-none"
            />
          </div>

          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Vorschau"
                className="border-accent max-h-60 w-full rounded border object-contain"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            className="bg-primary text-secondary mt-4 w-full cursor-pointer p-3 text-sm font-semibold tracking-wide uppercase focus:outline-none"
          >
            Hochladen
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ImageUpload;
