'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, User } from 'lucide-react';

interface Profile {
  id: string;
  name_en: string;
  name_bn: string;
  bio_en: string | null;
  bio_bn: string | null;
  interests_en: string[] | null;
  interests_bn: string[] | null;
  profile_image: string | null;
  creative_name: string | null;
  current_focus_en: string | null;
  current_focus_bn: string | null;
}

const emptyForm = {
  name_en: '',
  name_bn: '',
  bio_en: '',
  bio_bn: '',
  interests_en: '',
  interests_bn: '',
  profile_image: '',
  creative_name: '',
  current_focus_en: '',
  current_focus_bn: '',
};

export default function AdminProfilePage() {
  const supabase = createClient();

  const [profileId, setProfileId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        alert(error.message);
      } else if (data) {
        const profile = data as Profile;

        setProfileId(profile.id);

        setForm({
          name_en: profile.name_en || '',
          name_bn: profile.name_bn || '',
          bio_en: profile.bio_en || '',
          bio_bn: profile.bio_bn || '',
          interests_en: (profile.interests_en || []).join(', '),
          interests_bn: (profile.interests_bn || []).join(', '),
          profile_image: profile.profile_image || '',
          creative_name: profile.creative_name || '',
          current_focus_en: profile.current_focus_en || '',
          current_focus_bn: profile.current_focus_bn || '',
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name_en: form.name_en.trim(),
      name_bn: form.name_bn.trim(),
      bio_en: form.bio_en.trim() || null,
      bio_bn: form.bio_bn.trim() || null,

      interests_en: form.interests_en
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),

      interests_bn: form.interests_bn
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),

      profile_image: form.profile_image.trim() || null,
      creative_name: form.creative_name.trim() || null,
      current_focus_en: form.current_focus_en.trim() || null,
      current_focus_bn: form.current_focus_bn.trim() || null,
    };

    let error;

    if (profileId) {
      const result = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', profileId);

      error = result.error;
    } else {
      const result = await supabase
        .from('profiles')
        .insert(payload)
        .select('id')
        .single();

      error = result.error;

      if (result.data) {
        setProfileId(result.data.id);
      }
    }

    if (error) {
      alert(error.message);
    } else {
      alert('Profile saved successfully.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background text-white">
        <AdminSidebar />

        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-400" size={36} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-white">
      <AdminSidebar />

      <main className="flex-1 p-5 md:p-8">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-400 font-semibold">
              Admin
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Profile
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your public portfolio profile.
            </p>
          </div>

          <form
            onSubmit={save}
            className="bg-surface border border-surface-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <User className="text-primary-400" />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  Profile Information
                </h2>

                <p className="text-sm text-gray-500">
                  Changes are saved directly to Supabase.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                required
                placeholder="Name (English)"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                className="input"
              />

              <input
                required
                placeholder="Name (Bangla)"
                value={form.name_bn}
                onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
                className="input"
              />

              <input
                placeholder="Creative Name"
                value={form.creative_name}
                onChange={(e) => setForm({ ...form, creative_name: e.target.value })}
                className="input"
              />

              <input
                placeholder="Profile Image URL"
                value={form.profile_image}
                onChange={(e) => setForm({ ...form, profile_image: e.target.value })}
                className="input"
              />

              <textarea
                rows={6}
                placeholder="Bio (English)"
                value={form.bio_en}
                onChange={(e) => setForm({ ...form, bio_en: e.target.value })}
                className="input"
              />

              <textarea
                rows={6}
                placeholder="Bio (Bangla)"
                value={form.bio_bn}
                onChange={(e) => setForm({ ...form, bio_bn: e.target.value })}
                className="input"
              />

              <input
                placeholder="Interests English: Web Development, AI, Cyber Security"
                value={form.interests_en}
                onChange={(e) => setForm({ ...form, interests_en: e.target.value })}
                className="input"
              />

              <input
                placeholder="Interests Bangla"
                value={form.interests_bn}
                onChange={(e) => setForm({ ...form, interests_bn: e.target.value })}
                className="input"
              />

              <textarea
                rows={5}
                placeholder="Current Focus (English)"
                value={form.current_focus_en}
                onChange={(e) => setForm({ ...form, current_focus_en: e.target.value })}
                className="input"
              />

              <textarea
                rows={5}
                placeholder="Current Focus (Bangla)"
                value={form.current_focus_bn}
                onChange={(e) => setForm({ ...form, current_focus_bn: e.target.value })}
                className="input"
              />

            </div>

            <button
              disabled={saving}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}

              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}
