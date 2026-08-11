import '@/styles/globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'Aryan Islam Nirob | Personal 3D Life Story Portfolio',
  description:
    'Personal digital portfolio and life story of Aryan Islam Nirob, featuring memories, experiences, projects, and the CrypticX journey.',
  openGraph: {
    title: 'Aryan Islam Nirob | Personal 3D Portfolio',
    description: 'Explore the digital autobiography and 3D memory museum of Aryan Islam Nirob (CrypticX).',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-gray-100 antialiased selection:bg-primary-500 selection:text-white min-h-screen">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
