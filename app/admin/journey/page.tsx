'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Map,
} from 'lucide-react';

interface JourneyItem {
  id: string;
  year: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  image_url: string | null;
  location: string | null;
  link: string | null;
  sort_order: number;
  created_at: string;
}

const emptyForm = {
  year: '',
  title_en: '',
  title_bn: '',
  description_en: '',
  description_bn: '',
  image_url: '',
  location: '',
  link: '',
  sort_order: '0',
};

export default function AdminJourneyPage() {
  const supabase = createClient();

  const [items, setItems] = useState<JourneyItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('journey')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setItems((data || []) as JourneyItem[]);
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

  const openEdit = (item: JourneyItem) => {
    setEditingId(item.id);

    setForm({
      year: item.year || '',
      title_en: item.title_en || '',
      title_bn: item.title_bn || '',
      description_en: item.description_en || '',
      description_bn: item.description_bn || '',
      image_url: item.image_url || '',
      location: item.location || '',
      link: item.link || '',
      sort_order: String(item.sort_order ?? 0),
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
      year: form.year.trim(),
      title_en: form.title_en.trim(),
      title_bn: form.title_bn.trim(),
      description_en: form.description_en.trim(),
      description_bn: form.description_bn.trim(),
      image_url: form.image_url.trim() || null,
      location: form.location.trim() || null,
      link: form.link.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    };

    const result = editingId
      ? await supabase.from('journey').update(payload).eq('id', editingId)
      : await supabase.from('journey').insert(payload);

    if (result.error) {
      alert(result.error.message);
    } else {
      closeForm();
      await loadItems();
    }

    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this journey entry?')) return;

    const { error } = await supabase
      .from('journey')
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
              <h1 className="text-3xl font-bold mt-2">Journey</h1>
              <p className="text-gray-400 mt-2">
                Manage your personal journey timeline.
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-semibold"
            >
              <Plus size={18} />
              Add Journey
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={save}
              className="bg-surface border border-surface-border rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Edit Journey' : 'Add Journey'}
                </h2>

                <button type="button" onClick={closeForm}>
                  <X />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  required
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="input"
                />

                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input"
                />

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
                  placeholder="Image URL"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="input md:col-span-2"
                />

                <input
                  placeholder="Link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="input"
                />

                <input
                  type="number"
                  placeholder="Sort order"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="input"
                />

                <textarea
                  required
                  rows={6}
                  placeholder="Description (English)"
                  value={form.description_en}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                  className="input"
                />

                <textarea
                  required
                  rows={6}
                  placeholder="Description (Bangla)"
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
                {editingId ? 'Update Journey' : 'Save Journey'}
              </button>
            </form>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-400" size={32} />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-surface border border-surface-border rounded-2xl p-12 text-center">
              <Map className="mx-auto mb-4 text-gray-600" size={42} />
              <h2 className="text-lg font-semibold">No journey entries yet</h2>
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
                      <div className="flex items-center gap-3">
                        <span className="text-primary-400 font-bold">
                          {item.year}
                        </span>

                        {item.location && (
                          <span className="text-xs text-gray-500">
                            {item.location}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold mt-2">
                        {item.title_en}
                      </h2>

                      <p className="text-gray-400 mt-4 whitespace-pre-wrap">
                        {item.description_en}
                      </p>
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
