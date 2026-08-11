'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 text-xs font-semibold backdrop-blur">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`rounded-lg px-2.5 py-1.5 transition ${
          language === 'en'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`rounded-lg px-2.5 py-1.5 transition ${
          language === 'bn'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
