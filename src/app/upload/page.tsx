'use client';
import { LoadingSpinner } from '@/components/ui/loading';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-xl bg-stone-200 p-6"
    >
      <h2 className="mb-6 text-lg font-semibold tracking-wide text-stone-900 uppercase">
        Bild hochladen
      </h2>

      {error && <p className="p-2 text-center text-sm text-orange-600">{error}</p>}
      {message && <p className="p-2 text-center text-sm text-stone-900">{message}</p>}

      {isUploading && (
        <div className="text-center text-stone-900">
          <LoadingSpinner color={'stone-900'} />
          Lade hoch...
        </div>
      )}

      {!hasUploaded && !isUploading && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-wide text-stone-900 uppercase">Bild auswählen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border bg-stone-900 p-2 text-sm text-stone-200 focus:outline-none"
            />
          </div>

          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Vorschau"
                className="max-h-60 w-full rounded border border-stone-400 object-contain"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            className="mt-4 w-full cursor-pointer bg-stone-900 p-3 text-sm font-semibold tracking-wide text-stone-200 uppercase focus:outline-none"
          >
            Hochladen
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ImageUpload;
