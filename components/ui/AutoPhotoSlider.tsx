'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface AutoPhotoSliderProps {
  images: string[];
  interval?: number;
}

export default function AutoPhotoSlider({ images, interval = 4000 }: AutoPhotoSliderProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused || isFullscreen || images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval, isPaused, isFullscreen]);

  if (!images || images.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setIndex((prev) => (prev + 1) % images.length);
    if (diff < -50) setIndex((prev) => (prev - 1 + images.length) % images.length);
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-surface-border group bg-surface shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`Slide ${index + 1}`}
          initial={{ opacity: 0, scale: 1.05, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      <button
        onClick={() => setIsFullscreen(true)}
        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
      >
        <Maximize2 size={18} />
      </button>

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center items-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-primary-500' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white text-xl font-bold"
          >
            ✕ Close
          </button>
          <img src={images[index]} alt="Fullscreen view" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
