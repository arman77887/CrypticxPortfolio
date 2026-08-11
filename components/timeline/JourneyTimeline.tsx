'use client';

import { JourneyItem } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

interface JourneyTimelineProps {
  items: JourneyItem[];
}

export default function JourneyTimeline({ items }: JourneyTimelineProps) {
  const { language } = useLanguage();

  return (
    <div className="relative border-l-2 border-primary-600/30 ml-4 md:ml-32 my-12 space-y-12">
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative pl-8 md:pl-12"
        >
          {/* Node Dot */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary-500 border-4 border-background" />

          {/* Year Badge */}
          <span className="md:absolute md:-left-28 md:top-1 text-sm font-bold text-accent-cyan bg-surface px-2 py-1 rounded border border-surface-border inline-block mb-2 md:mb-0">
            {item.year}
          </span>

          {/* Content Card */}
          <div className="bg-surface border border-surface-border rounded-xl p-6 shadow-xl max-w-2xl">
            <h3 className="text-xl font-bold text-white">
              {language === 'bn' ? item.title_bn : item.title_en}
            </h3>
            <p className="text-gray-300 text-sm mt-2 leading-relaxed">
              {language === 'bn' ? item.description_bn : item.description_en}
            </p>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title_en}
                className="mt-4 rounded-lg max-h-60 w-full object-cover border border-surface-border"
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
