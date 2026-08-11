'use client';

import { useState } from 'react';
import { Memory } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

interface MemoryGalleryProps {
  memories: Memory[];
}

export default function MemoryGallery({ memories }: MemoryGalleryProps) {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  const categories = ['All', 'Life', 'Friends', 'Travel', 'Special Moments', 'Work', 'CrypticX'];

  const filtered = selectedCategory === 'All'
    ? memories
    : memories.filter((m) => m.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              selectedCategory === cat
                ? 'bg-primary-600 border-primary-500 text-white shadow-lg'
                : 'bg-surface border-surface-border text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((memory) => (
          <motion.div
            key={memory.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => setActiveMemory(memory)}
            className="bg-surface rounded-xl border border-surface-border overflow-hidden cursor-pointer group shadow-lg"
          >
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src={memory.image_url}
                alt={memory.title_en}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-black/60 text-accent-cyan px-2 py-0.5 rounded backdrop-blur">
                {memory.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">
                {language === 'bn' ? memory.title_bn : memory.title_en}
              </h3>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                {language === 'bn' ? memory.description_bn : memory.description_en}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Lightbox */}
      {activeMemory && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveMemory(null)}
        >
          <div
            className="bg-surface border border-surface-border max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={activeMemory.image_url} alt="Memory" className="w-full max-h-96 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {language === 'bn' ? activeMemory.title_bn : activeMemory.title_en}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {language === 'bn' ? activeMemory.description_bn : activeMemory.description_en}
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{activeMemory.location || t('Location unspecified', 'স্থান উল্লেখ নেই')}</span>
                <span>{activeMemory.memory_date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
