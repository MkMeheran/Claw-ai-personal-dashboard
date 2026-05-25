'use client';

import { useEffect, useState } from 'react';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroBadge } from '@/components/ui/RetroBadge';
import { RetroInput } from '@/components/ui/RetroInput';
import { Clipboard, Pin, Trash2, ExternalLink, Code, MapPin, Copy, Type } from 'lucide-react';
import { useClipboardStore, ClipboardItem } from '@/store/useClipboardStore';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function ClipboardPage() {
  const { items, isLoading, fetchItems, addClip, togglePin, deleteClip, addItem, updateItem, removeItem } = useClipboardStore();
  const [newClip, setNewClip] = useState('');
  const [search, setSearch] = useState('');

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
    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClip.trim()) return;
    await addClip(newClip, 'web');
    setNewClip('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredItems = items.filter(item => 
    item.content.toLowerCase().includes(search.toLowerCase())
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'url': return ExternalLink;
      case 'code': return Code;
      case 'address': return MapPin;
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
        <form onSubmit={handleAdd} className="flex gap-2">
          <RetroInput 
            value={newClip}
            onChange={(e) => setNewClip(e.target.value)}
            placeholder="Paste text, URL, or code..." 
            className="w-full sm:w-64"
          />
          <RetroButton type="submit" label="Add" variant="primary" icon={Clipboard} />
        </form>
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
          filteredItems.map((item) => {
            const TypeIcon = getIconForType(item.type);
            return (
              <div 
                key={item.id}
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
                      onClick={() => copyToClipboard(item.content)}
                      className="p-1 bg-stone-200 border-2 border-stone-900 rounded text-stone-700 active:translate-y-0.5 hover:bg-stone-300"
                    >
                      <Copy size={16} />
                    </button>
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
                  {item.content}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
