'use client';

import { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import ThreeBackground from '@/components/3d/ThreeBackground';
import Hero3D from '@/components/3d/Hero3D';
import AutoPhotoSlider from '@/components/ui/AutoPhotoSlider';
import MemoryGallery from '@/components/gallery/MemoryGallery';
import JourneyTimeline from '@/components/timeline/JourneyTimeline';
import AlbumViewer3D from '@/components/3d/AlbumViewer3D';
import { useLanguage } from '@/context/LanguageContext';
import { Memory, Album, JourneyItem } from '@/types/database';
import { Mail, Send, Github, Facebook, Instagram } from 'lucide-react';

// DEMO DATA (Placeholders until admin inserts real facts)
const demoSliderImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000',
];

const demoMemories: Memory[] = [
  {
    id: '1',
    title_en: 'DEMO CONTENT: Beginning of Coding',
    title_bn: 'ডেমো বিষয়বস্তু: কোডিংয়ের শুরু',
    description_en: 'First milestone project created under CrypticX alias.',
    description_bn: 'ক্রিপ্টিক এক্স অ্যালায়েসের অধীনে তৈরি প্রথম গুরুত্বপূর্ণ প্রজেক্ট।',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    category: 'CrypticX',
    memory_date: '2023-05-12',
  },
];

const demoJourney: JourneyItem[] = [
  {
    id: '1',
    year: '2022',
    title_en: 'Beginning of the Journey',
    title_bn: 'যাত্রার সূচনা',
    description_en: 'Started exploring software development and digital creation.',
    description_bn: 'সফটওয়্যার ডেভেলপমেন্ট এবং ডিজিটাল তৈরির অন্বেষণ শুরু।',
    sort_order: 1,
  },
  {
    id: '2',
    year: '2024',
    title_en: 'CrypticX Project Launch',
    title_bn: 'ক্রিপ্টিক এক্স প্রজেক্ট লঞ্চ',
    description_en: 'Established personal identity and core technical experiments.',
    description_bn: 'ব্যক্তিগত পরিচয় এবং মূল প্রযুক্তিগত পরীক্ষা প্রতিষ্ঠা করা হয়েছে।',
    sort_order: 2,
  },
];

export default function Home() {
  const { t } = useLanguage();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ThreeBackground />
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full border border-surface-border bg-surface text-accent-cyan text-xs font-mono">
            {t('Creative Identity: CrypticX', 'ক্রিয়েটিভ পরিচয়: CrypticX')}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Arian Islam Nirob
          </h1>
          <h2 className="text-2xl sm:text-3xl text-gray-400 font-bangla">
            আরিয়ান ইসলাম নিরব
          </h2>
          <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
            {t(
              'Welcome to my digital world. Step inside to explore my personal story, memory archives, and digital creations.',
              'আমার ডিজিটাল জগতে স্বাগতম। আমার ব্যক্তিগত গল্প, স্মৃতির আর্কাইভ এবং ডিজিটাল সৃষ্টিগুলো উপভোগ করুন।'
            )}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#journey"
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition shadow-lg shadow-primary-600/25"
            >
              {t('Explore My Story', 'আমার গল্প দেখুন')}
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-border text-white border border-surface-border font-semibold transition"
            >
              {t('Contact Me', 'যোগাযোগ করুন')}
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <Hero3D />
          <div className="-mt-16 w-full flex justify-center">
            <AutoPhotoSlider images={demoSliderImages} />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 px-4 max-w-5xl mx-auto">
        <div className="bg-surface/80 border border-surface-border rounded-2xl p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-surface-border pb-4">
            {t('About Me', 'আমার সম্পর্কে')}
          </h2>
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              {t(
                'Add your story here. This space represents the life journey, personal philosophy, and creative spirit of Arian Islam Nirob.',
                'এখানে আপনার গল্প লিখুন। এই জায়গাটি আরিয়ান ইসলাম নিরবের জীবনের পথচলা এবং মেধার বহিপ্রকাশ ঘটায়।'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section id="journey" className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          {t('My Journey', 'আমার পথচলা')}
        </h2>
        <JourneyTimeline items={demoJourney} />
      </section>

      {/* MEMORIES GALLERY */}
      <section id="memories" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {t('Memories', 'স্মৃতিগুলো')}
        </h2>
        <MemoryGallery memories={demoMemories} />
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 px-4 max-w-3xl mx-auto">
        <div className="bg-surface border border-surface-border rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('Send Me a Message', 'আমাকে বার্তা পাঠান')}
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                {t('Name', 'নাম')}
              </label>
              <input
                type="text"
                required
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                {t('Email', 'ইমেইল')}
              </label>
              <input
                type="email"
                required
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                {t('Message', 'বার্তা')}
              </label>
              <textarea
                rows={4}
                required
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Send size={18} />
              <span>{t('Send Message', 'বার্তা পাঠান')}</span>
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-surface-border py-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Arian Islam Nirob (CrypticX). All rights reserved.</p>
      </footer>
    </main>
  );
}
