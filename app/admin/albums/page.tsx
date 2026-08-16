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
  FolderKanban,
  Search,
} from 'lucide-react';

interface Album {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  cover_image: string;
  created_at: string;
}

const emptyForm = {
  title_en: '',
  title_bn: '',
  description_en: '',
  description_bn: '',
  cover_image: '',
};

export default function AdminAlbums() {
  const supabase = createClient();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const loadAlbums = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAlbums((data || []) as Album[]);
    } catch (error: any) {
      console.error('ALBUM LOAD ERROR:', error);

      alert(
        `Failed to load albums.\n\n` +
        `Message: ${error?.message || 'Unknown error'}\n` +
        `Code: ${error?.code || 'N/A'}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
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
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (album: Album) => {
    setEditingId(album.id);

    setForm({
      title_en: album.title_en,
      title_bn: album.title_bn,
      description_en: album.description_en || '',
      description_bn: album.description_bn || '',
      cover_image: album.cover_image,
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
        '/storage/v1/object/public/portfolio-albums/';

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
      .from('portfolio-albums')
      .remove([path]);

    if (error) {
      console.error('Album storage deletion error:', error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.cover_image) {
      alert('Please upload an album cover image.');
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
        description_en:
          form.description_en.trim() || null,
        description_bn:
          form.description_bn.trim() || null,
        cover_image: form.cover_image,
      };

      if (editingId) {
        const oldAlbum = albums.find(
          (album) => album.id === editingId
        );

        const { error } = await supabase
          .from('albums')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        if (
          oldAlbum &&
          oldAlbum.cover_image &&
          oldAlbum.cover_image !== form.cover_image
        ) {
          await deleteStorageImage(oldAlbum.cover_image);
        }

        alert('Album updated successfully.');
      } else {
        const { error } = await supabase
          .from('albums')
          .insert(payload);

        if (error) {
          await deleteStorageImage(form.cover_image);
          throw error;
        }

        alert('Album created successfully.');
      }

      closeForm();
      await loadAlbums();
    } catch (error: any) {
      console.error('ALBUM SAVE ERROR:', error);

      alert(
        `Failed to save album.\n\n` +
        `Message: ${error?.message || 'Unknown error'}\n` +
        `Code: ${error?.code || 'N/A'}\n` +
        `Details: ${error?.details || 'N/A'}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (album: Album) => {
    if (deleting) return;

    const confirmed = window.confirm(
      `Delete "${album.title_en}" permanently?\n\n` +
      `The album and its cover image will be removed.`
    );

    if (!confirmed) return;

    try {
      setDeleting(album.id);

      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', album.id);

      if (error) throw error;

      await deleteStorageImage(album.cover_image);

      setAlbums((current) =>
        current.filter((item) => item.id !== album.id)
      );

      alert('Album deleted successfully.');
    } catch (error: any) {
      console.error('ALBUM DELETE ERROR:', error);

      alert(
        error?.message || 'Failed to delete album.'
      );
    } finally {
      setDeleting(null);
    }
  };

  const filteredAlbums = albums.filter((album) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      album.title_en.toLowerCase().includes(query) ||
      album.title_bn.toLowerCase().includes(query) ||
      (album.description_en || '')
        .toLowerCase()
        .includes(query)
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
                Photo Albums
              </h1>

              <p className="text-gray-400 mt-2">
                Create and manage your portfolio albums.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 px-5 py-3 rounded-xl font-semibold transition"
            >
              <Plus size={18} />
              Add Album
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
                placeholder="Search albums..."
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
          ) : filteredAlbums.length === 0 ? (
            <div className="bg-surface border border-surface-border rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <FolderKanban
                  size={28}
                  className="text-gray-500"
                />
              </div>

              <h2 className="text-xl font-semibold">
                No albums yet
              </h2>

              <p className="text-gray-500 mt-2">
                Create your first photo album.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className="bg-surface border border-surface-border rounded-2xl overflow-hidden"
                >
                  <div className="aspect-video bg-black/20">
                    <img
                      src={album.cover_image}
                      alt={album.title_en}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="font-semibold text-lg">
                      {album.title_en}
                    </h2>

                    <p className="text-primary-300 text-sm mt-1">
                      {album.title_bn}
                    </p>

                    {album.description_en && (
                      <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                        {album.description_en}
                      </p>
                    )}

                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => openEdit(album)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] transition"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(album)}
                        disabled={deleting === album.id}
                        className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                      >
                        {deleting === album.id ? (
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
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-surface-border rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingId ? 'Edit Album' : 'Create Album'}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  {editingId
                    ? 'Update album information.'
                    : 'Add a new photo album.'}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Album Cover
                </label>

                <ImageUploader
                  bucket="portfolio-albums"
                  currentImageUrl={form.cover_image}
                  onUploadComplete={(url) =>
                    updateField('cover_image', url)
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    English Title
                  </label>

                  <input
                    value={form.title_en}
                    onChange={(e) =>
                      updateField('title_en', e.target.value)
                    }
                    required
                    className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                    placeholder="My Travel Album"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bangla Title
                  </label>

                  <input
                    value={form.title_bn}
                    onChange={(e) =>
                      updateField('title_bn', e.target.value)
                    }
                    required
                    className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                    placeholder="আমার ভ্রমণ অ্যালবাম"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  English Description
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
                  className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Bangla Description
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
                  className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex-1 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                >
                  {saving && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {editingId
                    ? 'Update Album'
                    : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
