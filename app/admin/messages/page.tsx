'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Mail, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load messages:', error);
      } else {
        setMessages((data || []) as Message[]);
      }

      setLoading(false);
    };

    loadMessages();
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-white">
      <AdminSidebar />

      <main className="flex-1 p-5 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-400 font-semibold">
              Admin
            </p>
            <h1 className="text-3xl font-bold mt-2">Messages</h1>
            <p className="text-gray-400 mt-2">
              Messages received from your portfolio contact form.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary-400" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-surface border border-surface-border rounded-2xl p-10 text-center">
              <Mail className="mx-auto text-gray-600 mb-4" size={40} />
              <h2 className="text-lg font-semibold">No messages yet</h2>
              <p className="text-gray-500 mt-2">
                Contact form submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-surface border border-surface-border rounded-2xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-lg">
                        {message.name}
                      </h2>
                      <p className="text-sm text-primary-400">
                        {message.email}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        message.is_read
                          ? 'bg-white/5 text-gray-500'
                          : 'bg-primary-500/10 text-primary-400'
                      }`}
                    >
                      {message.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>

                  <p className="mt-5 text-gray-300 leading-7 whitespace-pre-wrap">
                    {message.message}
                  </p>

                  <p className="mt-4 text-xs text-gray-600">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
