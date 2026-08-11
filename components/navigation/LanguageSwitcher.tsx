'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-surface border border-surface-border rounded-full p-1 text-xs font-semibold">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition ${
          language === 'en' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 rounded-full transition ${
          language === 'bn' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
