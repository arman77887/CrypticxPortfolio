'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, Compass } from 'lucide-react';

export default function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: t('About', 'সম্পর্কে') },
    { href: '#journey', label: t('Journey', 'পথচলা') },
    { href: '#crypticx', label: t('CrypticX', 'ক্রিপ্টিক এক্স') },
    { href: '#memories', label: t('Memories', 'স্মৃতি') },
    { href: '#albums', label: t('Albums', 'অ্যালবাম') },
    { href: '#experience', label: t('Experience', 'অভিজ্ঞতা') },
    { href: '#contact', label: t('Contact', 'যোগাযোগ') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/70 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <Compass className="text-primary-500" />
          <span>Arian Islam Nirob</span>
          <span className="text-xs text-accent-cyan bg-surface px-2 py-0.5 rounded border border-surface-border">
            CrypticX
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher />
        </nav>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-300 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-surface-border px-4 pt-2 pb-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base text-gray-300 hover:text-white py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
