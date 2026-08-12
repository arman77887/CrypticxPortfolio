'use client';

import { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import ThreeBackground from '@/components/3d/ThreeBackground';
import Hero3D from '@/components/3d/Hero3D';
import AutoPhotoSlider from '@/components/ui/AutoPhotoSlider';
import MemoryGallery from '@/components/gallery/MemoryGallery';
import JourneyTimeline from '@/components/timeline/JourneyTimeline';
import { useLanguage } from '@/context/LanguageContext';
import { Memory, JourneyItem } from '@/types/database';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Mail,
  Send,
  Github,
  Facebook,
  Instagram,
  Sparkles,
  Code2,
  Camera,
  Layers3,
  Heart,
  Lock,
} from 'lucide-react';

/*
|--------------------------------------------------------------------------
| DEMO CONTENT
|--------------------------------------------------------------------------
| এগুলো এখন test করার জন্য।
| পরে Supabase থেকে dynamic data আসবে।
*/

const demoSliderImages = [
  '/images/profile.jpg',
  '/images/photo1.jpg',
  '/images/photo2.jpg',
  '/images/photo3.jpg',
  '/images/photo4.jpg',
  '/images/photo5.jpg',
  '/images/photo6.jpg',
];

const demoMemories: Memory[] = [
  {
    id: '1',
    title_en: 'Beginning of Coding',
    title_bn: 'কোডিংয়ের শুরু',
    description_en:
      'A personal milestone from the early days of exploring technology and digital creation.',
    description_bn:
      'প্রযুক্তি ও ডিজিটাল জগতের সাথে পথচলার শুরুর দিকের একটি গুরুত্বপূর্ণ স্মৃতি।',
    image_url:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200',
    category: 'CrypticX',
    memory_date: '2023-05-12',
  },
];

const demoJourney: JourneyItem[] = [
  {
    id: '1',
    year: '2019',
    title_en: 'The Hidden Beginning',
    title_bn: 'নীরব সূচনা',
    description_en:
      'I began my journey quietly in 2019. Without telling anyone, I started exploring technology, digital creativity, and the skills I wanted to develop. I kept my work private and focused on learning, understanding, and developing control over my abilities.',
    description_bn:
      '২০১৯ সালে নীরবে আমার পথচলা শুরু করি। কাউকে না জানিয়ে প্রযুক্তি, ডিজিটাল সৃজনশীলতা এবং নিজের দক্ষতার বিভিন্ন দিক নিয়ে কাজ শুরু করি। নিজের কাজগুলো ব্যক্তিগত রেখেই শেখা, বোঝা এবং নিজের দক্ষতাকে নিয়ন্ত্রণ করার দিকে মনোযোগ দিই।',
    sort_order: 1,
  },
  {
    id: '2',
    year: '2020',
    title_en: 'Learning in Silence',
    title_bn: 'নীরবে শেখার সময়',
    description_en:
      'I continued learning quietly, experimenting with different ideas and technologies. Instead of showing what I could do, I focused on becoming better at what I was learning.',
    description_bn:
      'নীরবে শেখার পথচলা অব্যাহত রাখি। বিভিন্ন ধারণা ও প্রযুক্তি নিয়ে পরীক্ষা-নিরীক্ষা করতে থাকি। আমি কী পারি সেটা দেখানোর চেয়ে নিজের দক্ষতাকে আরও উন্নত করার দিকেই বেশি মনোযোগ দিই।',
    sort_order: 2,
  },
  {
    id: '3',
    year: '2021',
    title_en: 'Building My Skills',
    title_bn: 'দক্ষতা গড়ে তোলা',
    description_en:
      'This was a period of deeper learning and experimentation. I started connecting different skills and turning my ideas into practical digital projects while keeping much of my work private.',
    description_bn:
      'এই সময়টা ছিল আরও গভীরভাবে শেখা ও পরীক্ষা-নিরীক্ষার সময়। বিভিন্ন দক্ষতাকে একসাথে কাজে লাগিয়ে নিজের ধারণাগুলোকে বাস্তব ডিজিটাল প্রজেক্টে রূপ দিতে শুরু করি। তবুও আমার কাজের বড় একটি অংশ ব্যক্তিগতই রেখেছিলাম।',
    sort_order: 3,
  },
  {
    id: '4',
    year: '2022',
    title_en: 'Expanding the Vision',
    title_bn: 'ভাবনার বিস্তার',
    description_en:
      'I began looking beyond individual experiments and started thinking about larger ideas, projects, and a digital identity that could represent my work.',
    description_bn:
      'একক পরীক্ষা-নিরীক্ষার বাইরে আরও বড় কিছু নিয়ে ভাবতে শুরু করি। বিভিন্ন প্রজেক্ট, নতুন ধারণা এবং আমার কাজকে প্রতিনিধিত্ব করতে পারে এমন একটি ডিজিটাল পরিচয় নিয়ে চিন্তা করতে থাকি।',
    sort_order: 4,
  },
  {
    id: '5',
    year: '2023',
    title_en: 'CrypticX',
    title_bn: 'CrypticX',
    description_en:
      'CrypticX became the name behind my digital experiments and creative work. It represented a private journey of learning, building, experimenting, and discovering what I could create.',
    description_bn:
      'CrypticX আমার ডিজিটাল পরীক্ষা-নিরীক্ষা ও সৃজনশীল কাজের পরিচয় হয়ে ওঠে। এটি ছিল শেখা, তৈরি করা, পরীক্ষা করা এবং নিজের সামর্থ্যকে নতুনভাবে আবিষ্কার করার একটি ব্যক্তিগত যাত্রার প্রতীক।',
    sort_order: 5,
  },
  {
    id: '6',
    year: '2024',
    title_en: 'A Pause',
    title_bn: 'একটি বিরতি',
    description_en:
      'In 2024, I stepped away from everything I was building. Personal circumstances and important life decisions led me to pause my journey and put my projects on hold. It was not the end — it was simply a different chapter.',
    description_bn:
      '২০২৪ সালে আমি আমার চলমান কাজ ও প্রজেক্টগুলো থেকে সরে আসি। ব্যক্তিগত পরিস্থিতি এবং জীবনের কিছু গুরুত্বপূর্ণ সিদ্ধান্তের কারণে আমার পথচলায় বিরতি আসে এবং অনেক কাজ থামিয়ে রাখতে হয়। এটি শেষ ছিল না—শুধু জীবনের একটি ভিন্ন অধ্যায় ছিল।',
    sort_order: 6,
  },
  {
    id: '7',
    year: '2025',
    title_en: 'Reflection',
    title_bn: 'ফিরে দেখা',
    description_en:
      'After stepping away, I had time to reflect on the journey I had built since 2019. The pause gave me a different perspective on my skills, experiences, and the direction I wanted to take next.',
    description_bn:
      'পথচলায় বিরতি নেওয়ার পর ২০১৯ থেকে গড়ে তোলা যাত্রাটাকে নতুনভাবে ফিরে দেখার সময় পেয়েছি। এই বিরতি আমার দক্ষতা, অভিজ্ঞতা এবং ভবিষ্যতে কোন পথে এগোতে চাই—এসব বিষয়কে নতুন দৃষ্টিতে ভাবার সুযোগ দিয়েছে।',
    sort_order: 7,
  },
  {
    id: '8',
    year: '2026',
    title_en: 'The Journey Continues',
    title_bn: 'পথচলা চলমান',
    description_en:
      'My journey is not over. For now, I am keeping some parts of my life and creative work on hold while respecting my family’s wishes and working through personal circumstances. I will continue this journey when the time is right, when I have the permission and freedom to move forward. Until then, I keep learning, reflecting, and preparing for the next chapter.',
    description_bn:
      'আমার পথচলা শেষ হয়নি। আপাতত পরিবারের ইচ্ছাকে সম্মান করে এবং ব্যক্তিগত পরিস্থিতি কাটিয়ে ওঠার জন্য আমার জীবনের ও সৃজনশীল কাজের কিছু অংশ স্থগিত রেখেছি। যখন সঠিক সময় আসবে, যখন অনুমতি ও স্বাধীনভাবে এগিয়ে যাওয়ার সুযোগ পাব, তখন আবার এই পথচলা চালিয়ে যাব। ততদিন আমি শেখা, চিন্তা করা এবং পরবর্তী অধ্যায়ের জন্য নিজেকে প্রস্তুত করে যাব।',
    sort_order: 8,
  },
];

export default function Home() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState('');

  const [cyberModalOpen, setCyberModalOpen] = useState(false);
  const [cyberPassword, setCyberPassword] = useState('');
  const [cyberLoading, setCyberLoading] = useState(false);
  const [cyberError, setCyberError] = useState('');
  const [cyberUnlocked, setCyberUnlocked] = useState(false);
  const [cyberDetails, setCyberDetails] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const unlockCyberSecurity = async () => {
    setCyberError('');

    if (!cyberPassword.trim()) {
      setCyberError('Password is required.');
      return;
    }

    setCyberLoading(true);

    try {
      const response = await fetch('/api/cyber-security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: cyberPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setCyberError(data.message || 'Incorrect password.');
        setCyberUnlocked(false);
        setCyberDetails(null);
        return;
      }

      setCyberUnlocked(true);
      setCyberDetails(data.experience);
      setCyberPassword('');
    } catch {
      setCyberError('Unable to verify password. Please try again.');
    } finally {
      setCyberLoading(false);
    }
  };
  const { t } = useLanguage();
  const [showTop, setShowTop] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      <ThreeBackground />
      <Navbar />

      {/* HERO */}
      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">

          {/* Text */}
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-200 backdrop-blur">
              <Sparkles size={14} />
              {t('Creative Identity · CrypticX', 'সৃজনশীল পরিচয় · CrypticX')}
            </div>

            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-70 blur-md" />
                <img
                  src="/images/profile.jpg"
                  alt="Aryan Islam Nirob"
                  className="relative h-14 w-14 rounded-full border-2 border-white/20 object-cover shadow-2xl sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                />
              </div>

              <div className="min-w-0">
                <h1 className="whitespace-nowrap text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Aryan Islam Nirob
                </h1>

                <p className="mt-1 text-base font-bold tracking-[0.35em] text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text sm:text-lg">
                  CrypticX
                </p>
              </div>
            </div>

            <p className="mt-5 text-base font-medium text-gray-300 sm:text-lg">
              {t(
                'Welcome to my personal digital space.',
                'আমার ব্যক্তিগত ডিজিটাল জগতে স্বাগতম।'
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                {t('Explore My Story', 'আমার গল্প দেখুন')}
                <ArrowDown size={18} />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-gray-200 backdrop-blur transition hover:bg-white/10"
              >
                {t('Contact Me', 'যোগাযোগ করুন')}
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400">
                <Code2 className="mr-2 inline" size={14} />
                Digital Creator
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400">
                <Camera className="mr-2 inline" size={14} />
                Memories
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400">
                <Layers3 className="mr-2 inline" size={14} />
                CrypticX
              </div>
            </div>
          </div>

          {/* 3D + Photo */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-indigo-600/20 blur-[100px]" />

            <Hero3D />

            <div className="relative z-10 -mt-16 w-full max-w-sm sm:-mt-20">
              <AutoPhotoSlider images={demoSliderImages} interval={4000} />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-3">
              <Heart className="text-indigo-300" size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
                {t('Personal', 'ব্যক্তিগত')}
              </p>

              <h2 className="text-3xl font-black">
                {t('About Me', 'আমার পরিচয়')}
              </h2>
            </div>
          </div>

          <div className="space-y-5 text-base leading-8 text-gray-300">
            <p>
              {t(
                'I am Aryan Islam Nirob. This website is my personal digital portfolio — a place where I can preserve my story, experiences, photographs, memories and creative work.',
                'আমি একজন ক্রিয়েটিভ ডিজিটাল নির্মাতা। এই ওয়েবসাইটটি আমার ব্যক্তিগত ডিজিটাল পোর্টফোলিও — যেখানে আমার গল্প, অভিজ্ঞতা, ছবি, স্মৃতি এবং সৃজনশীল কাজ সংরক্ষিত থাকবে।'
              )}
            </p>

            <p>
              {t(
                'CrypticX is the creative identity I use for my digital experiments, projects and technology-focused work.',
                'CrypticX হলো আমার ডিজিটাল পরীক্ষা-নিরীক্ষা, প্রজেক্ট এবং প্রযুক্তিভিত্তিক কাজের সৃজনশীল পরিচয়।'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* CRYPTICX */}
      <section id="crypticx" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8">
            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-indigo-300">
              CRYPTICX
            </p>

            <h2 className="text-4xl font-black">
              {t(
                'More than a name.',
                'শুধু একটি নাম নয়।'
              )}
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-gray-300">
              {t(
                'CrypticX represents curiosity, experimentation, creativity and the desire to build something of my own.',
                'CrypticX আমার কৌতূহল, পরীক্ষা-নিরীক্ষা, সৃজনশীলতা এবং নিজের কিছু তৈরি করার ইচ্ছাকে প্রকাশ করে।'
              )}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <Sparkles className="mb-5 text-indigo-300" size={30} />

            <h3 className="text-xl font-bold">
              {t('My Digital Identity', 'আমার ডিজিটাল পরিচয়')}
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              {t(
                'Projects, ideas, experiments and memories connected with CrypticX.',
                'CrypticX-এর সাথে যুক্ত প্রজেক্ট, আইডিয়া, পরীক্ষা এবং স্মৃতিগুলো।'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300">
            {t('Timeline', 'সময়রেখা')}
          </p>

          <h2 className="mt-2 text-4xl font-black">
            {t('My Journey', 'আমার পথচলা')}
          </h2>
        </div>

        <JourneyTimeline items={demoJourney} />
      </section>

      {/* MEMORIES */}
      <section id="memories" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300">
            {t('Personal Archive', 'ব্যক্তিগত আর্কাইভ')}
          </p>

          <h2 className="mt-2 text-4xl font-black">
            {t('Memories', 'স্মৃতিগুলো')}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            {t(
              'A visual collection of moments that matter.',
              'আমার কাছে গুরুত্বপূর্ণ মুহূর্তগুলোর একটি ভিজ্যুয়াল সংগ্রহ।'
            )}
          </p>
        </div>

        <MemoryGallery memories={demoMemories} />
      </section>

      {/* ALBUMS */}
      <section id="albums" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl sm:p-12">
          <Camera className="mx-auto mb-5 text-indigo-300" size={38} />

          <h2 className="text-4xl font-black">
            {t('Photo Albums', 'ছবির অ্যালবাম')}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-gray-400">
            {t(
              'Personal albums will live here — travel, life, projects, special moments and memories.',
              'এখানে থাকবে আমার ব্যক্তিগত অ্যালবাম — ভ্রমণ, জীবন, প্রজেক্ট, বিশেষ মুহূর্ত এবং স্মৃতি।'
            )}
          </p>

          <div className="mt-8 inline-flex rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-3 text-sm text-indigo-200">
            {t('Albums will be connected to Supabase later.', 'পরে Supabase-এর সাথে অ্যালবামগুলো যুক্ত করা হবে।')}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300">
            {t('What I Learned', 'যা শিখেছি')}
          </p>

          <h2 className="mt-2 text-4xl font-black">
            {t('Experience', 'অভিজ্ঞতা')}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              en: 'Web Developer',
              bn: 'ওয়েব ডেভেলপার',
              desc_en:
                'Building modern websites and interactive digital experiences with a focus on clean design, functionality and user experience.',
              desc_bn:
                'আধুনিক ওয়েবসাইট ও ইন্টার‍্যাক্টিভ ডিজিটাল অভিজ্ঞতা তৈরি করি, যেখানে ডিজাইন, কার্যকারিতা এবং ব্যবহারকারীর অভিজ্ঞতাকে গুরুত্ব দেওয়া হয়।',
            },
            {
              en: 'Digital Marketing',
              bn: 'ডিজিটাল মার্কেটিং',
              desc_en:
                'Exploring digital platforms, content strategies, audience growth and creative ways to build an online presence.',
              desc_bn:
                'ডিজিটাল প্ল্যাটফর্ম, কনটেন্ট স্ট্র্যাটেজি, অডিয়েন্স গ্রোথ এবং অনলাইন পরিচিতি তৈরির সৃজনশীল পদ্ধতি নিয়ে কাজ করেছি।',
            },
            {
              en: 'Creative Technology',
              bn: 'ক্রিয়েটিভ টেকনোলজি',
              desc_en:
                'Combining technology and creativity to turn ideas into useful and engaging digital projects.',
              desc_bn:
                'প্রযুক্তি ও সৃজনশীলতাকে একসাথে ব্যবহার করে বিভিন্ন ধারণাকে বাস্তব ও আকর্ষণীয় ডিজিটাল প্রজেক্টে রূপ দেওয়ার অভিজ্ঞতা।',
            },
            {
              en: 'Digital Content & Media',
              bn: 'ডিজিটাল কনটেন্ট ও মিডিয়া',
              desc_en:
                'Creating, exploring and managing digital content while learning how ideas connect with people through online media.',
              desc_bn:
                'ডিজিটাল কনটেন্ট তৈরি, পরিচালনা এবং অনলাইন মিডিয়ার মাধ্যমে মানুষের কাছে বিভিন্ন ধারণা পৌঁছে দেওয়ার অভিজ্ঞতা।',
            },
          ].map(({ en, bn, desc_en, desc_bn }, index) => (
            <div
              key={en}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.06]"
            >
              <div className="mb-4 text-sm font-bold text-indigo-300">
                0{index + 1}
              </div>

              <h3 className="text-lg font-bold">
                {t(en, bn)}
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-400">
                {t(desc_en, desc_bn)}
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setCyberModalOpen(true);
              setCyberError('');
            }}
            aria-label="Open protected experience"
            className="group rounded-2xl border border-transparent bg-transparent p-6 text-left transition hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.02]"
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-indigo-300">
              05
              <Lock
                size={15}
                className="text-indigo-400 transition group-hover:scale-110"
              />
            </div>

            <h3 className="text-lg font-bold text-white">
              {t('Protected Experience', 'সুরক্ষিত অভিজ্ঞতা')}
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-400">
              {t(
                'Private • Restricted Access',
                'ব্যক্তিগত • সীমিত প্রবেশাধিকার'
              )}
            </p>
          </button>
        </div>

        {cyberModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
            onClick={() => {
              if (!cyberLoading) {
                setCyberModalOpen(false);
                setCyberError('');
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="protected-experience-title"
              className="w-full max-w-md rounded-3xl border border-indigo-400/20 bg-[#07111f] p-7 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {!cyberUnlocked ? (
                <>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
                    <Lock className="text-indigo-300" size={22} />
                  </div>

                  <h3
                    id="protected-experience-title"
                    className="text-2xl font-black"
                  >
                    {t('Protected Experience', 'সুরক্ষিত অভিজ্ঞতা')}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {t(
                      'This section contains private information. Enter the password to continue.',
                      'এই অংশে ব্যক্তিগত তথ্য রয়েছে। চালিয়ে যেতে পাসওয়ার্ড দিন।'
                    )}
                  </p>

                  <form
                    className="mt-6"
                    onSubmit={(event) => {
                      event.preventDefault();
                      unlockCyberSecurity();
                    }}
                  >
                    <label
                      htmlFor="cyber-password"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      {t('Enter Password', 'পাসওয়ার্ড দিন')}
                    </label>

                    <input
                      id="cyber-password"
                      type="password"
                      value={cyberPassword}
                      onChange={(event) => {
                        setCyberPassword(event.target.value);
                        setCyberError('');
                      }}
                      autoComplete="current-password"
                      disabled={cyberLoading}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                      placeholder="••••••••••••"
                    />

                    {cyberError && (
                      <p className="mt-3 text-sm text-red-400">
                        {cyberError}
                      </p>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        disabled={cyberLoading}
                        onClick={() => {
                          setCyberModalOpen(false);
                          setCyberError('');
                        }}
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.05] disabled:opacity-50"
                      >
                        {t('Cancel', 'বাতিল')}
                      </button>

                      <button
                        type="submit"
                        disabled={cyberLoading}
                        className="flex-1 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cyberLoading
                          ? t('Checking...', 'যাচাই হচ্ছে...')
                          : t('Unlock', 'আনলক')}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
                      <Lock className="text-indigo-300" size={22} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setCyberModalOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      {t('Close', 'বন্ধ করুন')}
                    </button>
                  </div>

                  <h3 className="text-2xl font-black">
                    {cyberDetails?.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {cyberDetails?.description}
                  </p>

                  <div className="mt-6 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-4 text-sm leading-7 text-gray-300">
                    {t(
                      'Private Cyber Security experience details are protected and available only after verification.',
                      'ব্যক্তিগত সাইবার সিকিউরিটি অভিজ্ঞতার বিস্তারিত যাচাইয়ের পরই দেখা যাবে।'
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300">
              {t('Get in Touch', 'যোগাযোগ')}
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {t('Contact Me', 'আমার সাথে যোগাযোগ করুন')}
            </h2>
          </div>

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setContactLoading(true);
              setContactStatus('');

              try {
                const response = await fetch('/api/contact', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: contactName,
                    email: contactEmail,
                    message: contactMessage,
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to send message.');
                }

                setContactStatus(
                  t(
                    'Message sent successfully!',
                    'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!'
                  )
                );

                setContactName('');
                setContactEmail('');
                setContactMessage('');
              } catch (error) {
                console.error(error);
                setContactStatus(
                  t(
                    'Failed to send message. Please try again.',
                    'বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।'
                  )
                );
              } finally {
                setContactLoading(false);
              }
            }}
          >
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t('Name', 'নাম')}
              </label>

              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t('Your name', 'আপনার নাম')}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t('Email', 'ইমেইল')}
              </label>

              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {t('Message', 'বার্তা')}
              </label>

              <textarea
                rows={5}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={t('Write your message...', 'আপনার বার্তা লিখুন...')}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={contactLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />
              {contactLoading
                ? t('Sending...', 'পাঠানো হচ্ছে...')
                : t('Send Message', 'বার্তা পাঠান')}
            </button>

            {contactStatus && (
              <p className="text-center text-sm text-indigo-300">
                {contactStatus}
              </p>
            )}
          </form>

          <div className="mt-8 flex justify-center gap-3">
            <a
              href="#"
              aria-label="GitHub"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 transition hover:text-white"
            >
              <Github size={20} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 transition hover:text-white"
            >
              <Facebook size={20} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 transition hover:text-white"
            >
              <Instagram size={20} />
            </a>

            <a
              href="mailto:"
              aria-label="Email"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 transition hover:text-white"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-4 py-10 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Aryan Islam Nirob
        </p>

        <p className="mt-2 text-xs tracking-[0.3em] text-indigo-300">
          CRYPTICX
        </p>

        <p className="mt-3 text-xs text-gray-600">
          {t(
            'Built as my personal digital space.',
            'আমার ব্যক্তিগত ডিজিটাল জগত হিসেবে তৈরি।'
          )}
        </p>
      </footer>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-white/10 bg-black/70 p-3 text-gray-300 shadow-xl backdrop-blur transition hover:bg-indigo-600 hover:text-white"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </main>
  );
}
