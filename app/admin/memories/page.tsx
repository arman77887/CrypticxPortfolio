'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ImageUploader from '@/components/admin/ImageUploader';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Calendar,
  MapPin,
  Search,
  Image as ImageIcon,
} from 'lucide-react';

interface Memory {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  image_url: string;
  category: string;
  memory_date: string | null;
  location: string | null;
  created_at: string;
}

const emptyForm = {
  title_en: '',
  title_bn: '',
  description_en: '',
  description_bn: '',
  image_url: '',
  category: 'Life',
  memory_date: new Date().toISOString().split('T')[0],
  location: '',
};

export default function AdminMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const supabase = createClient();

  const loadMemories = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('memory_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMemories((data || []) as Memory[]);
    } catch (error: any) {
      console.error('MEMORIES LOAD ERROR:', error);

      alert(
        `Failed to load memories.\n\n` +
        `Message: ${error?.message || 'Unknown error'}\n` +
        `Code: ${error?.code || 'N/A'}\n` +
        `Details: ${error?.details || 'N/A'}\n` +
        `Hint: ${error?.hint || 'N/A'}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const updateField = (
    field: keyof typeof emptyForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      memory_date: new Date().toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const openEdit = (memory: Memory) => {
    setEditingId(memory.id);

    setForm({
      title_en: memory.title_en,
      title_bn: memory.title_bn,
      description_en: memory.description_en || '',
      description_bn: memory.description_bn || '',
      image_url: memory.image_url,
      category: memory.category || 'Life',
      memory_date:
        memory.memory_date ||
        new Date().toISOString().split('T')[0],
      location: memory.location || '',
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const getStoragePath = (url: string) => {
    try {
      const parsed = new URL(url);
      const marker =
        '/storage/v1/object/public/portfolio-memories/';

      const index = parsed.pathname.indexOf(marker);

      if (index === -1) return null;

      return decodeURIComponent(
        parsed.pathname.substring(index + marker.length)
      );
    } catch {
      return null;
    }
  };

  const deleteStorageImage = async (url: string) => {
    if (!url) return;

    const path = getStoragePath(url);

    if (!path) return;

    const { error } = await supabase.storage
      .from('portfolio-memories')
      .remove([path]);

    if (error) {
      console.error('Storage deletion error:', error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.image_url) {
      alert('Please upload a memory image.');
      return;
    }

    if (!form.title_en.trim() || !form.title_bn.trim()) {
      alert('English and Bangla titles are required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title_en: form.title_en.trim(),
        title_bn: form.title_bn.trim(),
        description_en: form.description_en.trim() || null,
        description_bn: form.description_bn.trim() || null,
        image_url: form.image_url,
        category: form.category,
        memory_date: form.memory_date || null,
        location: form.location.trim() || null,
      };

      if (editingId) {
        const oldMemory = memories.find(
          (memory) => memory.id === editingId
        );

        const { error } = await supabase
          .from('memories')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        if (
          oldMemory &&
          oldMemory.image_url &&
          oldMemory.image_url !== form.image_url
        ) {
          await deleteStorageImage(oldMemory.image_url);
        }

        alert('Memory updated successfully.');
      } else {
        const { error } = await supabase
          .from('memories')
          .insert(payload);

        if (error) {
          await deleteStorageImage(form.image_url);
          throw error;
        }

        alert('Memory created successfully.');
      }

      closeForm();
      await loadMemories();
    } catch (error: any) {
      console.error('MEMORY SAVE ERROR:', error);

      alert(
        `Failed to save memory.\n\n` +
        `Message: ${error?.message || 'Unknown error'}\n` +
        `Code: ${error?.code || 'N/A'}\n` +
        `Details: ${error?.details || 'N/A'}\n` +
        `Hint: ${error?.hint || 'N/A'}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (memory: Memory) => {
    if (deleting) return;

    const confirmed = window.confirm(
      `Delete "${memory.title_en}" permanently?\n\nThe database record and Storage image will be removed.`
    );

    if (!confirmed) return;

    try {
      setDeleting(memory.id);

      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memory.id);

      if (error) throw error;

      await deleteStorageImage(memory.image_url);

      setMemories((current) =>
        current.filter((item) => item.id !== memory.id)
      );

      alert('Memory deleted successfully.');
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete memory.'
      );
    } finally {
      setDeleting(null);
    }
  };

  const filteredMemories = memories.filter((memory) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      memory.title_en.toLowerCase().includes(query) ||
      memory.title_bn.toLowerCase().includes(query) ||
      memory.category.toLowerCase().includes(query) ||
      (memory.location || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-background text-white">
      <AdminSidebar />

      <main className="flex-1 min-w-0 p-5 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary-400 font-semibold mb-2">
                Content Management
              </p>

              <h1 className="text-3xl md:text-4xl font-bold">
                Memories
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your personal memories and gallery images.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 px-5 py-3 rounded-xl font-semibold transition"
            >
              <Plus size={18} />
              Add Memory
            </button>
          </div>

          <div className="bg-surface border border-surface-border rounded-2xl p-4 mb-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search memories..."
                className="w-full bg-background border border-surface-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2
                size={32}
                className="animate-spin text-primary-400"
              />
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="bg-surface border border-surface-border rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <ImageIcon
                  size={28}
                  className="text-gray-500"
                />
              </div>

              <h2 className="text-xl font-semibold">
                {search
                  ? 'No memories found'
                  : 'No memories yet'}
              </h2>

              <p className="text-gray-500 mt-2 mb-6">
                {search
                  ? 'Try another search term.'
                  : 'Create your first memory to get started.'}
              </p>

              {!search && (
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-5 py-2.5 rounded-xl font-semibold"
                >
                  <Plus size={17} />
                  Create Memory
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMemories.map((memory) => (
                <article
                  key={memory.id}
                  className="group bg-surface border border-surface-border rounded-2xl overflow-hidden hover:border-primary-500/30 transition"
                >
                  <div className="relative h-56 bg-black/20">
                    <img
                      src={memory.image_url}
                      alt={memory.title_en}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-xs font-semibold text-white">
                        {memory.category}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(memory)}
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(memory)}
                        disabled={deleting === memory.id}
                        className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-105 transition disabled:opacity-60"
                        title="Delete"
                      >
                        {deleting === memory.id ? (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="font-bold text-lg line-clamp-1">
                      {memory.title_en}
                    </h2>

                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                      {memory.title_bn}
                    </p>

                    {memory.description_en && (
                      <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                        {memory.description_en}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
                      {memory.memory_date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} />
                          {memory.memory_date}
                        </span>
                      )}

                      {memory.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} />
                          {memory.location}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-5 pt-4 border-t border-white/5">
                      <button
                        onClick={() => openEdit(memory)}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-sm font-medium transition"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(memory)}
                        disabled={deleting === memory.id}
                        className="px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition disabled:opacity-50"
                      >
                        {deleting === memory.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="min-h-full flex items-start md:items-center justify-center py-8">
            <div className="w-full max-w-3xl bg-surface border border-surface-border rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-surface-border">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingId
                      ? 'Edit Memory'
                      : 'Create Memory'}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Add bilingual content and a memory image.
                  </p>
                </div>

                <button
                  onClick={closeForm}
                  disabled={saving}
                  className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Title (English) *
                    </label>

                    <input
                      value={form.title_en}
                      onChange={(e) =>
                        updateField(
                          'title_en',
                          e.target.value
                        )
                      }
                      required
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      placeholder="A beautiful memory"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Title (Bangla) *
                    </label>

                    <input
                      value={form.title_bn}
                      onChange={(e) =>
                        updateField(
                          'title_bn',
                          e.target.value
                        )
                      }
                      required
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      placeholder="একটি সুন্দর স্মৃতি"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Description (English)
                    </label>

                    <textarea
                      value={form.description_en}
                      onChange={(e) =>
                        updateField(
                          'description_en',
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-primary-500"
                      placeholder="Describe this memory..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Description (Bangla)
                    </label>

                    <textarea
                      value={form.description_bn}
                      onChange={(e) =>
                        updateField(
                          'description_bn',
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-primary-500"
                      placeholder="এই স্মৃতির বর্ণনা..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Category
                    </label>

                    <select
                      value={form.category}
                      onChange={(e) =>
                        updateField(
                          'category',
                          e.target.value
                        )
                      }
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="Life">Life</option>
                      <option value="Friends">Friends</option>
                      <option value="Travel">Travel</option>
                      <option value="Special Moments">
                        Special Moments
                      </option>
                      <option value="Work">Work</option>
                      <option value="CrypticX">
                        CrypticX
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Memory Date
                    </label>

                    <input
                      type="date"
                      value={form.memory_date}
                      onChange={(e) =>
                        updateField(
                          'memory_date',
                          e.target.value
                        )
                      }
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Location
                    </label>

                    <input
                      value={form.location}
                      onChange={(e) =>
                        updateField(
                          'location',
                          e.target.value
                        )
                      }
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      placeholder="Taif, Saudi Arabia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-3">
                    Memory Image *
                  </label>

                  <ImageUploader
                    bucket="portfolio-memories"
                    currentImageUrl={form.image_url}
                    onUploadComplete={(url) =>
                      updateField('image_url', url)
                    }
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-gray-300 font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-60"
                  >
                    {saving && (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {saving
                      ? 'Saving...'
                      : editingId
                        ? 'Update Memory'
                        : 'Create Memory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
