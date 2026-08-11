'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: t('About', 'পরিচয়') },
    { href: '#crypticx', label: t('CrypticX', 'ক্রিপ্টিক এক্স') },
    { href: '#journey', label: t('Journey', 'পথচলা') },
    { href: '#memories', label: t('Memories', 'স্মৃতি') },
    { href: '#albums', label: t('Albums', 'অ্যালবাম') },
    { href: '#experience', label: t('Experience', 'অভিজ্ঞতা') },
    { href: '#contact', label: t('Contact', 'যোগাযোগ') },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/10">
            <Sparkles
              size={18}
              className="text-indigo-300 transition group-hover:rotate-12"
            />
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white sm:text-base">
              Aryan Islam Nirob
            </div>
            <div className="text-[10px] font-medium tracking-[0.25em] text-indigo-300">
              CRYPTICX
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-gray-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}

          <LanguageSwitcher />
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />

          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200 transition hover:bg-white/10"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-white/10 bg-black/90 px-4 py-4 backdrop-blur-2xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
