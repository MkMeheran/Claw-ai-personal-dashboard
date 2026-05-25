'use client';

import { useEffect, useState, useRef } from 'react';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroBadge } from '@/components/ui/RetroBadge';
import { RetroInput } from '@/components/ui/RetroInput';
import { Clipboard, Pin, Trash2, ExternalLink, Code, MapPin, Copy, Type, Image as ImageIcon, Download, RefreshCw } from 'lucide-react';
import { useClipboardStore, ClipboardItem } from '@/store/useClipboardStore';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import React from 'react';

const ClipboardCard = React.memo(({ item, togglePin, copyToClipboard, downloadImage, deleteClip, getIconForType }: any) => {
  const TypeIcon = getIconForType(item.type);
  return (
    <div 
      className={cn(
        "bg-stone-50 border-[3px] rounded-lg p-3 flex flex-col gap-2 transition-transform duration-200",
        item.is_pinned ? "border-amber-500" : "border-stone-900"
      )}
      style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-2">
          <RetroBadge color={item.type === 'url' ? 'sky' : item.type === 'code' ? 'fuchsia' : item.type === 'address' ? 'emerald' : 'amber'}>
            <span className="flex items-center gap-1">
              <TypeIcon size={12} />
              {item.type}
            </span>
          </RetroBadge>
          <span className="text-xs font-bold text-stone-500">
            {new Date(item.created_at).toLocaleString()} • from {item.device_source}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => togglePin(item.id, item.is_pinned)}
            className={cn("p-1 border-2 border-stone-900 rounded active:translate-y-0.5", item.is_pinned ? "bg-amber-400 text-stone-900" : "bg-stone-200 text-stone-500 hover:bg-stone-300")}
          >
            <Pin size={16} />
          </button>
          <button 
            onClick={() => copyToClipboard(item)}
            className="p-1 bg-stone-200 border-2 border-stone-900 rounded text-stone-700 active:translate-y-0.5 hover:bg-stone-300"
          >
            <Copy size={16} />
          </button>
          {item.type === 'image' && (
            <button 
              onClick={() => downloadImage(item.content)}
              className="p-1 bg-emerald-400 border-2 border-stone-900 rounded text-stone-900 active:translate-y-0.5 hover:bg-emerald-500"
            >
              <Download size={16} />
            </button>
          )}
          {item.type === 'url' && (
            <a 
              href={item.content.startsWith('http') ? item.content : `https://${item.content}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 bg-sky-400 border-2 border-stone-900 rounded text-stone-900 active:translate-y-0.5 hover:bg-sky-500"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <button 
            onClick={() => deleteClip(item.id)}
            className="p-1 bg-red-400 border-2 border-stone-900 rounded text-stone-900 active:translate-y-0.5 hover:bg-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className={cn(
        "font-[family-name:var(--font-space)] font-bold text-sm overflow-hidden break-words",
        item.type === 'code' ? "font-[family-name:var(--font-space-mono)] whitespace-pre-wrap bg-stone-900 text-stone-100 p-2 rounded border-2 border-stone-950 mt-1" : "line-clamp-3"
      )}>
        {item.type === 'image' ? (
          <img src={item.content} alt="Clipboard Image" className="max-h-64 object-contain rounded border-2 border-stone-900" loading="lazy" />
        ) : (
          item.content
        )}
      </div>
    </div>
  );
});

export default function ClipboardPage() {
  const { items, isLoading, fetchItems, addClip, togglePin, deleteClip, addItem, updateItem, removeItem } = useClipboardStore();
  const [newClip, setNewClip] = useState('');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map((file) => {
      if (!file.type.startsWith('image/')) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const currentItems = useClipboardStore.getState().items;
          const isDuplicate = currentItems.some(i => i.content === base64data);
          if (!isDuplicate) {
            await addClip(base64data, 'web (uploaded)');
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(uploadPromises);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchItems();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchItems();

    // Subscribe to realtime changes
    const setupSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const channel = supabase
        .channel('clipboard_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'clipboard_items', filter: `user_id=eq.${session.user.id}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              addItem(payload.new as ClipboardItem);
            } else if (payload.eventType === 'UPDATE') {
              updateItem(payload.new.id, payload.new as ClipboardItem);
            } else if (payload.eventType === 'DELETE') {
              removeItem(payload.old.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupSubscription();

    // Auto-fetch local clipboard when window gains focus
    const handleFocus = async () => {
      try {
        let text = '';
        try {
          const clipboardItems = await navigator.clipboard.read();
          for (const item of clipboardItems) {
            const imageType = item.types.find(t => t.startsWith('image/'));
            if (imageType) {
              const blob = await item.getType(imageType);
              const reader = new FileReader();
              reader.onloadend = async () => {
                const base64data = reader.result as string;
                const currentItems = useClipboardStore.getState().items;
                const isDuplicate = currentItems.some(i => i.content === base64data);
                if (!isDuplicate) {
                  await useClipboardStore.getState().addClip(base64data, 'web (auto-fetch)');
                }
              };
              reader.readAsDataURL(blob);
              return; // We found an image, stop here
            }
          }
          text = await navigator.clipboard.readText();
        } catch (e) {
          text = await navigator.clipboard.readText();
        }

        if (text && text.trim().length > 0) {
          const currentItems = useClipboardStore.getState().items;
          const isDuplicate = currentItems.some(i => i.content === text);
          if (!isDuplicate) {
            await useClipboardStore.getState().addClip(text, 'web (auto-fetch)');
          }
        }
      } catch (err) {
        // Ignore clipboard read errors (usually permission denied)
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      cleanup.then(fn => fn && fn());
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClip.trim()) return;
    await addClip(newClip, 'web');
    setNewClip('');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); // Stop image from being pasted as raw text
        const blob = items[i].getAsFile();
        if (!blob) continue;

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const currentItems = useClipboardStore.getState().items;
          const isDuplicate = currentItems.some(i => i.content === base64data);
          if (!isDuplicate) {
            await useClipboardStore.getState().addClip(base64data, 'web (manual-paste)');
          }
        };
        reader.readAsDataURL(blob);
        return; // Stop after first image
      }
    }
  };

  const copyToClipboard = async (item: ClipboardItem) => {
    if (item.type === 'image' && item.content.startsWith('data:image/')) {
      try {
        const res = await fetch(item.content);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new window.ClipboardItem({ [blob.type]: blob })
        ]);
        return;
      } catch (err) {
        console.error("Failed to copy image", err);
      }
    }
    navigator.clipboard.writeText(item.content);
  };

  const downloadImage = (content: string) => {
    const a = document.createElement('a');
    a.href = content;
    a.download = `nexus-clipboard-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredItems = items.filter(item => 
    item.content.toLowerCase().includes(search.toLowerCase())
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'url': return ExternalLink;
      case 'code': return Code;
      case 'address': return MapPin;
      case 'image': return ImageIcon;
      default: return Type;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Clipboard Hub
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Real-time sync history and pinned items.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleImageUpload}
            accept="image/*"
            multiple
          />
          <RetroButton 
            onClick={() => fileInputRef.current?.click()} 
            icon={ImageIcon} 
            label=""
            className="shrink-0 text-amber-500"
          />
          <RetroButton 
            onClick={handleRefresh} 
            icon={RefreshCw} 
            label=""
            className={isRefreshing ? 'animate-spin shrink-0' : 'shrink-0'} 
          />
          <form onSubmit={handleAdd} className="flex gap-2 flex-1 sm:flex-initial">
            <RetroInput 
              value={newClip}
              onChange={(e) => setNewClip(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste text, URL, code, or photo..." 
              className="w-full sm:w-64"
            />
            <RetroButton type="submit" label="Add" variant="primary" icon={Clipboard} />
          </form>
        </div>
      </header>

      <div className="mb-4">
         <RetroInput 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clipboard history..." 
         />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
           <div className="h-32 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg">
             Syncing clipboard data...
           </div>
        ) : filteredItems.length === 0 ? (
           <div className="h-32 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg">
             {search ? "No clips match your search." : "Clipboard history is empty. Add a clip!"}
           </div>
        ) : (
          filteredItems.map((item) => (
            <ClipboardCard 
              key={item.id} 
              item={item} 
              togglePin={togglePin} 
              copyToClipboard={copyToClipboard} 
              downloadImage={downloadImage} 
              deleteClip={deleteClip} 
              getIconForType={getIconForType} 
            />
          ))
        )}
      </div>
    </div>
  );
}
