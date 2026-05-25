'use client';

import { useEffect, useState, useRef } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { Image as ImageIcon, Upload, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { useMediaStore } from '@/store/useMediaStore';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function MediaPage() {
  const { items, isLoading, fetchMedia } = useMediaStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      const token = sessionData.session?.provider_token;
      
      if (!token) {
        throw new Error('No Google Drive access token found. Please re-login with Google.');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);

      const res = await fetch('/api/drive', {
        method: 'POST',
        body: formData
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        // Fallback for demo: just store in Supabase without Drive
        data = { id: 'stub_id', url: '#', thumbnail: null };
      }

      // Save metadata to supabase
      await supabase.from('media_items').insert({
        user_id: userId,
        drive_file_id: data.id,
        drive_url: data.url,
        thumbnail_url: data.thumbnail,
        file_name: file.name,
        file_type: file.type,
        size_bytes: file.size
      });

      fetchMedia();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const deleteMedia = async (id: string) => {
    await supabase.from('media_items').delete().eq('id', id);
    fetchMedia();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Media Vault
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Your synced photos and screenshots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <RetroButton 
            onClick={() => fileInputRef.current?.click()} 
            label={isUploading ? "Uploading..." : "Upload Media"} 
            icon={Upload} 
            variant="primary" 
            disabled={isUploading}
          />
        </div>
      </header>

      <RetroCard title="Gallery" icon={ImageIcon} accentColor="fuchsia">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg mt-2">
            Loading media...
          </div>
        ) : items.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg mt-2">
            No media found. Upload something!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-stone-200 border-[3px] border-stone-900 rounded-lg overflow-hidden aspect-square"
                style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}
              >
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.file_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 p-2 text-center">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] break-words w-full line-clamp-2">
                      {item.file_name}
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <button onClick={() => copyUrl(item.drive_url)} className="p-2 bg-stone-100 border-2 border-stone-900 rounded text-stone-900 hover:bg-amber-400 active:translate-y-0.5">
                      <Copy size={16} />
                    </button>
                    <a href={item.drive_url} target="_blank" rel="noreferrer" className="p-2 bg-stone-100 border-2 border-stone-900 rounded text-stone-900 hover:bg-sky-400 active:translate-y-0.5">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <button onClick={() => deleteMedia(item.id)} className="p-2 bg-red-500 border-2 border-stone-900 rounded text-white active:translate-y-0.5">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </RetroCard>
    </div>
  );
}
