'use client';

import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

type ProductImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function ProductImageUploader({ images, onChange }: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;

    const body = new FormData();
    Array.from(files).forEach((file) => body.append('files', file));

    setIsUploading(true);
    try {
      const response = await fetch('/api/admin/uploads/products', {
        method: 'POST',
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Image upload failed');
        return;
      }

      onChange([...images, ...result.urls]);
      if (inputRef.current) inputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (image: string) => {
    onChange(images.filter((item) => item !== image));
  };

  const makeMainImage = (image: string) => {
    onChange([image, ...images.filter((item) => item !== image)]);
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
      <label>Product Images</label>
      <div
        style={{
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg)',
          background: 'var(--bg-surface)',
          display: 'grid',
          gap: 'var(--space-md)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(event) => uploadImages(event.target.files)}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            gap: 8,
            minHeight: 44,
          }}
        >
          <ImagePlus size={18} />
          {isUploading ? 'Uploading...' : 'Upload Images From PC'}
        </button>

        {!!images.length && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-md)' }}>
            {images.map((image, index) => (
              <div key={image} style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                <img src={image} alt={`Product image ${index + 1}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                <div style={{ display: 'flex', gap: 4, padding: 6 }}>
                  <button
                    type="button"
                    onClick={() => makeMainImage(image)}
                    title="Set as main image"
                    style={{ flex: 1, minHeight: 34, color: index === 0 ? 'var(--secondary)' : 'var(--text-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Star size={15} fill={index === 0 ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    title="Remove image"
                    style={{ flex: 1, minHeight: 34, color: 'var(--error)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          The first image is used as the main product image. Upload JPG, PNG, WEBP, or GIF files.
        </p>
      </div>
    </div>
  );
}
