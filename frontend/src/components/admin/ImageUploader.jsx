import { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import api from '@/api/axios';

export default function ImageUploader({ value, onChange }) {
  const fileInputRef                  = useRef(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging]       = useState(false);

  async function upload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setUploadError('Only image files are allowed.'); return; }
    if (file.size > 10 * 1024 * 1024)   { setUploadError('Image must be under 10 MB.'); return; }
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData);
      onChange(data.url);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="flex flex-col gap-2">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-stroke bg-muted" style={{ aspectRatio: '16/9' }}>
          <img src={value} alt="Cake preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/35 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-brown shadow hover:bg-muted transition-colors">
              Change
            </button>
            <button type="button" onClick={() => onChange('')} className="px-3 py-1.5 rounded-lg bg-crimson text-white text-xs font-semibold shadow hover:bg-crimson/90 transition-colors">
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 size={26} className="animate-spin text-crimson" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8 transition-colors ${
            dragging ? 'border-crimson bg-crimson/5' : 'border-stroke hover:border-crimson/50 hover:bg-muted/40'
          } ${uploading ? 'cursor-wait' : 'cursor-pointer'}`}
        >
          {uploading ? (
            <Loader2 size={28} className="animate-spin text-crimson" />
          ) : (
            <>
              <UploadCloud size={28} className={dragging ? 'text-crimson' : 'text-muted-foreground/40'} />
              <p className="text-xs text-muted-foreground">Click or drag &amp; drop an image</p>
              <p className="text-[11px] text-muted-foreground/50">PNG, JPG, WEBP - max 10 MB</p>
            </>
          )}
        </button>
      )}

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
