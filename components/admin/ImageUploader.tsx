'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  bucket: string;
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
}

export default function ImageUploader({ bucket, onUploadComplete, currentImageUrl }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      setPreview(data.publicUrl);
      onUploadComplete(data.publicUrl);
    } catch (error) {
      alert('Failed to upload image.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full max-w-xs h-40 rounded-lg overflow-hidden border border-surface-border group">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onUploadComplete('');
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-surface-border rounded-lg cursor-pointer hover:border-primary-500 transition bg-surface/50">
          {uploading ? (
            <Loader2 className="animate-spin text-primary-500" size={24} />
          ) : (
            <>
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-xs text-gray-400">Click or drag image to upload</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}
    </div>
  );
}
