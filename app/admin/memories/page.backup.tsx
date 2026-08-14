'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ImageUploader from '@/components/admin/ImageUploader';
import { createClient } from '@/lib/supabase/client';

export default function AdminMemories() {
  const [imageUrl, setImageUrl] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descBn, setDescBn] = useState('');
  const [category, setCategory] = useState('Life');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Please upload an image first');

    const { error } = await supabase.from('memories').insert({
      title_en: titleEn,
      title_bn: titleBn,
      description_en: descEn,
      description_bn: descBn,
      image_url: imageUrl,
      category,
      memory_date: new Date().toISOString().split('T')[0],
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Memory added successfully!');
      setTitleEn('');
      setTitleBn('');
      setDescEn('');
      setDescBn('');
      setImageUrl('');
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-white">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Manage Memories</h1>
        <form onSubmit={handleSubmit} className="bg-surface border border-surface-border p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Title (English)</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Title (Bangla)</label>
              <input
                type="text"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                required
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Description (English)</label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Description (Bangla)</label>
              <textarea
                value={descBn}
                onChange={(e) => setDescBn(e.target.value)}
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg px-4 py-2 text-white"
            >
              <option value="Life">Life</option>
              <option value="Friends">Friends</option>
              <option value="Travel">Travel</option>
              <option value="Special Moments">Special Moments</option>
              <option value="Work">Work</option>
              <option value="CrypticX">CrypticX</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">Memory Image</label>
            <ImageUploader bucket="portfolio-memories" onUploadComplete={(url) => setImageUrl(url)} />
          </div>

          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Save Memory
          </button>
        </form>
      </main>
    </div>
  );
}
