'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, X, Loader2, Briefcase } from 'lucide-react';

interface Experience {
  id: string;
  title_en: string;
  title_bn: string;
  organization: string;
  description_en: string | null;
  description_bn: string | null;
  skills: string[] | null;
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  link: string | null;
  created_at: string;
}

const emptyForm = {
  title_en: '',
  title_bn: '',
  organization: '',
  description_en: '',
  description_bn: '',
  skills: '',
  start_date: '',
  end_date: '',
  image_url: '',
  link: '',
};

export default function AdminExperiencesPage() {
  const supabase = createClient();

  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setItems((data || []) as Experience[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: Experience) => {
    setEditingId(item.id);

    setForm({
      title_en: item.title_en || '',
      title_bn: item.title_bn || '',
      organization: item.organization || '',
      description_en: item.description_en || '',
      description_bn: item.description_bn || '',
      skills: (item.skills || []).join(', '),
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      image_url: item.image_url || '',
      link: item.link || '',
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title_en: form.title_en.trim(),
      title_bn: form.title_bn.trim(),
      organization: form.organization.trim(),
      description_en: form.description_en.trim() || null,
      description_bn: form.description_bn.trim() || null,
      skills: form.skills
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      start_date: form.start_date,
      end_date: form.end_date || null,
      image_url: form.image_url.trim() || null,
      link: form.link.trim() || null,
    };

    const result = editingId
      ? await supabase
          .from('experiences')
          .update(payload)
          .eq('id', editingId)
      : await supabase
          .from('experiences')
          .insert(payload);

    if (result.error) {
      alert(result.error.message);
    } else {
      closeForm();
      await loadItems();
    }

    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this experience?')) return;

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      await loadItems();
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-white">
      <AdminSidebar />

      <main className="flex-1 p-5 md:p-8">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-400 font-semibold">
                Admin
              </p>
              <h1 className="text-3xl font-bold mt-2">Experiences</h1>
              <p className="text-gray-400 mt-2">
                Manage professional and creative experiences.
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-semibold hover:bg-primary-400 transition"
            >
              <Plus size={18} />
              Add Experience
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={save}
              className="bg-surface border border-surface-border rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Edit Experience' : 'Add Experience'}
                </h2>

                <button type="button" onClick={closeForm}>
                  <X />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Title (English)"
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="input"
                />

                <input
                  required
                  placeholder="Title (Bangla)"
                  value={form.title_bn}
                  onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
                  className="input"
                />

                <input
                  required
                  placeholder="Organization"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="input"
                />

                <input
                  required
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="input"
                />

                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="input"
                />

                <input
                  placeholder="Skills: React, Next.js, Supabase"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="input"
                />

                <input
                  placeholder="Image URL"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="input md:col-span-2"
                />

                <input
                  placeholder="Link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="input md:col-span-2"
                />

                <textarea
                  placeholder="Description (English)"
                  rows={5}
                  value={form.description_en}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                  className="input"
                />

                <textarea
                  placeholder="Description (Bangla)"
                  rows={5}
                  value={form.description_bn}
                  onChange={(e) => setForm({ ...form, description_bn: e.target.value })}
                  className="input"
                />
              </div>

              <button
                disabled={saving}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold disabled:opacity-50"
              >
                {saving && <Loader2 className="animate-spin" size={18} />}
                {editingId ? 'Update Experience' : 'Save Experience'}
              </button>
            </form>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-400" size={32} />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-surface border border-surface-border rounded-2xl p-12 text-center">
              <Briefcase className="mx-auto mb-4 text-gray-600" size={42} />
              <h2 className="text-lg font-semibold">No experiences yet</h2>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface border border-surface-border rounded-2xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">{item.title_en}</h2>
                      <p className="text-primary-400 mt-1">
                        {item.organization}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        {item.start_date}
                        {item.end_date ? ` → ${item.end_date}` : ' → Present'}
                      </p>

                      {item.description_en && (
                        <p className="text-gray-400 mt-4 whitespace-pre-wrap">
                          {item.description_en}
                        </p>
                      )}

                      {item.skills?.length ? (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs rounded-full bg-primary-500/10 text-primary-300 px-3 py-1"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => remove(item.id)}
                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
