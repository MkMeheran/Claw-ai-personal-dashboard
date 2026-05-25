'use client';

import { useEffect, useState } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroBadge } from '@/components/ui/RetroBadge';
import { Trash2, RotateCcw, AlertTriangle, FileText, Image as ImageIcon, Shield, Link2, Clipboard, RefreshCw } from 'lucide-react';
import { useRecycleBinStore, RecycleItem } from '@/store/useRecycleBinStore';
import { cn } from '@/lib/utils';

export default function RecycleBinPage() {
  const { items, isLoading, fetchItems, restoreItem, deletePermanently, emptyBin } = useRecycleBinStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchItems();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'clipboard_items': return Clipboard;
      case 'media_items': return ImageIcon;
      case 'notes': return FileText;
      case 'vault_secrets': return Shield;
      case 'saved_links': return Link2;
      default: return FileText;
    }
  };

  const formatPayload = (item: RecycleItem) => {
    try {
      if (item.original_table === 'clipboard_items') {
        if (item.payload.type === 'image') return "Image Data (Base64)";
        return item.payload.content || 'Unknown Content';
      }
      if (item.original_table === 'media_items') return item.payload.file_name || 'Media File';
      if (item.original_table === 'notes') return item.payload.title || item.payload.content || 'Untitled Note';
      if (item.original_table === 'vault_secrets') return item.payload.service_name || 'Secret';
      if (item.original_table === 'saved_links') return item.payload.title || item.payload.url || 'Link';
      return JSON.stringify(item.payload).substring(0, 50) + '...';
    } catch (e) {
      return 'Encrypted / Unknown Data';
    }
  };

  const getDaysLeft = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const expireDate = new Date(deletedDate.getTime() + (20 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diffTime = Math.abs(expireDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Trash2 size={28} /> Recycle Bin
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Items deleted from any module are stored here for 20 days before permanent deletion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RetroButton 
            onClick={handleRefresh} 
            icon={RefreshCw} 
            label=""
            className={isRefreshing ? 'animate-spin' : ''} 
          />
          <RetroButton 
            onClick={() => {
              if (confirm("Are you sure you want to completely empty the Recycle Bin? This action cannot be undone.")) {
                emptyBin();
              }
            }} 
            label="Empty Bin" 
            icon={AlertTriangle} 
            variant="danger" 
            disabled={items.length === 0}
          />
        </div>
      </header>

      <RetroCard title="Deleted Items" icon={Trash2} className="flex-1 bg-stone-100 min-h-[500px]" accentColor="stone">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg">
            Scanning deleted items...
          </div>
        ) : items.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg gap-3">
            <Trash2 size={48} className="opacity-50" />
            Recycle Bin is completely empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-2">
            {items.map(item => {
              const Icon = getTableIcon(item.original_table);
              const daysLeft = getDaysLeft(item.deleted_at);
              
              return (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border-[3px] border-stone-900 rounded-lg gap-4"
                  style={{ boxShadow: "inset 2px 2px 0px rgba(255,255,255,0.4), inset -1px -1px 0px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 shrink-0 bg-stone-200 border-2 border-stone-900 rounded flex items-center justify-center">
                      <Icon size={20} className="text-stone-700" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-sm text-stone-900 truncate">
                        {formatPayload(item)}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <RetroBadge color="stone">{item.original_table.replace('_', ' ')}</RetroBadge>
                        <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                          {daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => restoreItem(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-400 border-2 border-stone-900 rounded font-bold text-xs text-stone-900 hover:bg-emerald-500 active:translate-y-0.5"
                    >
                      <RotateCcw size={14} /> Restore
                    </button>
                    <button 
                      onClick={() => deletePermanently(item.id)}
                      className="p-1.5 bg-red-500 border-2 border-stone-900 rounded text-white hover:bg-red-600 active:translate-y-0.5"
                      title="Delete Permanently"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </RetroCard>
    </div>
  );
}
