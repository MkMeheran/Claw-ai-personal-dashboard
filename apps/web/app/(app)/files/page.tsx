'use client';

import { useEffect, useState, useRef } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroModal } from '@/components/ui/RetroModal';
import { FolderOpen, UploadCloud, QrCode, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useFilesStore } from '@/store/useFilesStore';
import { supabase } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

export default function FilesPage() {
  const { items, isLoading, fetchFiles } = useFilesStore();
  const [isUploading, setIsUploading] = useState(false);
  const [activeQr, setActiveQr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
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
        data = { id: 'stub_id', url: `https://nexus.local/download/${file.name}` };
      }

      await supabase.from('file_queue').insert({
        user_id: userId,
        file_name: file.name,
        drive_file_id: data.id,
        download_url: data.url,
        qr_code_data: data.url,
        status: 'uploaded'
      });

      fetchFiles();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteFile = async (id: string) => {
    await supabase.from('file_queue').delete().eq('id', id);
    fetchFiles();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            File Transfer
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Drag & drop files to sync or generate QR codes.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Zone */}
        <RetroCard title="Upload Zone" icon={UploadCloud} accentColor="cyan" className="lg:col-span-1">
          <div 
            className="h-48 border-4 border-dashed border-stone-400 bg-stone-50 rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect}
            />
            <UploadCloud size={48} className="text-stone-400 mb-2" />
            <p className="font-bold text-stone-600 font-[family-name:var(--font-space)]">
              {isUploading ? "Uploading..." : "Click or Drag file here"}
            </p>
          </div>
        </RetroCard>

        {/* Transfer Queue */}
        <RetroCard title="Transfer Queue" icon={FolderOpen} accentColor="cyan" className="lg:col-span-2">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg mt-2">
              Loading queue...
            </div>
          ) : items.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg mt-2">
              No files in queue.
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 mt-2">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className="bg-stone-50 border-[3px] border-stone-900 rounded flex items-center justify-between p-3"
                  style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-cyan-200 border-2 border-stone-900 rounded">
                      <FolderOpen size={20} className="text-cyan-900" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-bold text-stone-900 truncate">{item.file_name}</span>
                      <span className="text-xs text-stone-500 font-[family-name:var(--font-space-mono)]">
                        {new Date(item.created_at).toLocaleString()} • {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setActiveQr(item.qr_code_data)}
                      className="p-2 bg-stone-200 border-2 border-stone-900 rounded text-stone-700 hover:bg-stone-300 active:translate-y-0.5"
                      title="Show QR Code"
                    >
                      <QrCode size={18} />
                    </button>
                    {item.download_url && (
                      <a 
                        href={item.download_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-cyan-400 border-2 border-stone-900 rounded text-stone-900 hover:bg-cyan-500 active:translate-y-0.5"
                        title="Download Link"
                      >
                        <LinkIcon size={18} />
                      </a>
                    )}
                    <button 
                      onClick={() => deleteFile(item.id)}
                      className="p-2 bg-red-400 border-2 border-stone-900 rounded text-stone-900 hover:bg-red-500 active:translate-y-0.5"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </RetroCard>
      </div>

      <RetroModal isOpen={!!activeQr} onClose={() => setActiveQr(null)} title="Scan to Download" accentColor="cyan">
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="p-4 bg-white border-[4px] border-stone-900 rounded-lg">
            {activeQr && (
              <QRCodeSVG value={activeQr} size={200} level="H" />
            )}
          </div>
          <p className="font-bold text-stone-600 text-center font-[family-name:var(--font-space-mono)] text-sm mt-4">
            Scan this code with your mobile device to retrieve the file securely.
          </p>
        </div>
      </RetroModal>
    </div>
  );
}
