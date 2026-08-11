'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-extrabold text-primary-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">
        {t('Lost in the digital world?', 'ডিজিটাল জগতে হারিয়ে গেছেন?')}
      </h2>
      <p className="text-gray-400 text-sm max-w-md mb-8">
        {t(
          'The node or memory you are trying to access does not exist or has been shifted.',
          'আপনি যে স্মৃতির পাতায় প্রবেশ করার চেষ্টা করছেন তা পাওয়া যায়নি।'
        )}
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition shadow-lg"
      >
        {t('Back Home', 'ফিরে যান')}
      </Link>
    </div>
  );
}
