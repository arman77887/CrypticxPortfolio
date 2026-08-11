'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Album, AlbumPhoto } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface AlbumViewer3DProps {
  album: Album | null;
  photos: AlbumPhoto[];
  onClose: () => void;
}

export default function AlbumViewer3D({ album, photos, onClose }: AlbumViewer3DProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!album) return null;

  const currentPhoto = photos[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-surface-border text-white hover:bg-primary-600 transition"
        >
          <X size={24} />
        </button>

        <div className="max-w-5xl w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'bn' ? album.title_bn : album.title_en}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {language === 'bn' ? album.description_bn : album.description_en}
          </p>

          {photos.length > 0 ? (
            <div className="relative w-full aspect-video max-h-[60vh] flex items-center justify-center group">
              <motion.img
                key={currentPhoto?.id || currentIndex}
                src={currentPhoto?.image_url || album.cover_image}
                alt="Album Image"
                initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.4 }}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-surface-border"
              />

              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 p-3 rounded-full bg-surface/80 text-white hover:bg-primary-600 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 p-3 rounded-full bg-surface/80 text-white hover:bg-primary-600 transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-500 py-12">No photos in this album.</div>
          )}

          {/* Thumbnail Strip */}
          {photos.length > 1 && (
            <div className="flex gap-2 mt-6 overflow-x-auto max-w-full p-2">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                    idx === currentIndex ? 'border-primary-500 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={photo.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
