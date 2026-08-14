'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Image, FolderKanban, Briefcase, Map, Mail, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/profile', label: 'Profile', icon: User },
    { href: '/admin/memories', label: 'Memories', icon: Image },
    { href: '/admin/albums', label: 'Albums', icon: FolderKanban },
    { href: '/admin/experiences', label: 'Experiences', icon: Briefcase },
    { href: '/admin/journey', label: 'Journey', icon: Map },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-surface border-r border-surface-border min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="text-white font-bold text-xl px-4 py-3 border-b border-surface-border mb-6">
          CrypticX Admin
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-surface-border hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition w-full"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
