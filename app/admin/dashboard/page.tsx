'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import {
  Image,
  FolderKanban,
  Mail,
  ArrowRight,
  Loader2,
  Plus,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  memories: number;
  albums: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    memories: 0,
    albums: 0,
    unreadMessages: 0,
  });

  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          memoriesResult,
          albumsResult,
          messagesResult,
        ] = await Promise.all([
          supabase
            .from('memories')
            .select('*', {
              count: 'exact',
              head: true,
            }),

          supabase
            .from('albums')
            .select('*', {
              count: 'exact',
              head: true,
            }),

          supabase
            .from('contact_messages')
            .select('*', {
              count: 'exact',
              head: true,
            })
            .eq('is_read', false),
        ]);

        if (memoriesResult.error) {
          console.error(memoriesResult.error);
        }

        if (albumsResult.error) {
          console.error(albumsResult.error);
        }

        if (messagesResult.error) {
          console.error(messagesResult.error);
        }

        setStats({
          memories: memoriesResult.count || 0,
          albums: albumsResult.count || 0,
          unreadMessages: messagesResult.count || 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      label: 'Total Memories',
      value: stats.memories,
      icon: Image,
      href: '/admin/memories',
      action: 'Manage Memories',
    },
    {
      label: 'Photo Albums',
      value: stats.albums,
      icon: FolderKanban,
      href: '/admin/albums',
      action: 'Manage Albums',
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: Mail,
      href: '/admin/messages',
      action: 'View Messages',
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-white">
      <AdminSidebar />

      <main className="flex-1 min-w-0 p-5 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-400 font-semibold mb-2">
                CrypticX Control Center
              </p>

              <h1 className="text-3xl md:text-4xl font-bold">
                Premium Dashboard
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your portfolio content from one place.
              </p>
            </div>

            <Link
              href="/admin/memories"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 px-5 py-3 rounded-xl font-semibold transition"
            >
              <Plus size={18} />
              Add Memory
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group bg-surface border border-surface-border rounded-2xl p-6 hover:border-primary-500/30 hover:-translate-y-1 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <Icon
                        size={23}
                        className="text-primary-400"
                      />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition"
                    />
                  </div>

                  <p className="text-gray-400 text-sm mt-6">
                    {card.label}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    {loading ? (
                      <Loader2
                        size={26}
                        className="animate-spin text-primary-400"
                      />
                    ) : (
                      <p className="text-4xl font-bold">
                        {card.value}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mt-3">
                    {card.action}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 bg-surface border border-surface-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Activity
                  size={19}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h2 className="font-semibold">
                  Admin System
                </h2>

                <p className="text-xs text-gray-500">
                  Current panel status
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Database
                </p>
                <p className="text-sm text-emerald-400 font-medium mt-1">
                  Connected
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Storage
                </p>
                <p className="text-sm text-emerald-400 font-medium mt-1">
                  portfolio-memories
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Authentication
                </p>
                <p className="text-sm text-emerald-400 font-medium mt-1">
                  Supabase Auth
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
