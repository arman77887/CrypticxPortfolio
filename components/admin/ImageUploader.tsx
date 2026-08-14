'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  bucket: string;
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
}

function getStoragePath(url: string, bucket: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(
      parsed.pathname.substring(index + marker.length)
    );
  } catch {
    return null;
  }
}

export default function ImageUploader({
  bucket,
  onUploadComplete,
  currentImageUrl,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null
  );

  const supabase = createClient();

  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be smaller than 10MB.');
      return;
    }

    try {
      setUploading(true);

      const extension =
        file.name.split('.').pop()?.toLowerCase() || 'jpg';

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setPreview(data.publicUrl);
      onUploadComplete(data.publicUrl);
    } catch (error) {
      console.error('Image upload error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to upload image.'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!preview || deleting) return;

    const confirmed = window.confirm(
      'Delete this image permanently from Storage?'
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const storagePath = getStoragePath(preview, bucket);

      if (storagePath) {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([storagePath]);

        if (error) {
          throw error;
        }
      }

      setPreview(null);
      onUploadComplete('');
    } catch (error) {
      console.error('Image delete error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete image.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full max-w-md h-56 rounded-2xl overflow-hidden border border-white/10 bg-black/20 group">
          <img
            src={preview}
            alt="Memory preview"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-xs text-white/80">
              Memory image
            </span>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition disabled:opacity-60"
            title="Delete image"
          >
            {deleting ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <X size={17} />
            )}
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-md h-56 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary-500/60 hover:bg-white/[0.03] transition">
          {uploading ? (
            <>
              <Loader2
                className="animate-spin text-primary-400 mb-3"
                size={30}
              />
              <span className="text-sm text-gray-400">
                Uploading image...
              </span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center mb-3">
                {uploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ImageIcon
                    size={24}
                    className="text-gray-400"
                  />
                )}
              </div>

              <span className="text-sm font-medium text-gray-300">
                Upload memory image
              </span>

              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP • Maximum 10MB
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
