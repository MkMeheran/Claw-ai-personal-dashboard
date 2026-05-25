'use client';

import { useEffect, useState } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroBadge } from '@/components/ui/RetroBadge';
import { 
  Timer, Clipboard, Image as ImageIcon, Link2, Plus, RefreshCw 
} from 'lucide-react';
import { useClipboardStore } from '@/store/useClipboardStore';
import { useMediaStore } from '@/store/useMediaStore';
import Link from 'next/link';

export default function DashboardPage() {
  const { items: clipboardItems, fetchItems: fetchClipboard } = useClipboardStore();
  const { items: mediaItems, fetchMedia } = useMediaStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchClipboard();
    fetchMedia();
  }, [fetchClipboard, fetchMedia]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchClipboard(), fetchMedia()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const recentUrls = clipboardItems.filter(i => i.type === 'url').slice(0, 3);
  const recentClips = clipboardItems.slice(0, 3);
  const recentMedia = mediaItems.slice(0, 4);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Command Center
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Welcome back, Operator. All systems operational.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RetroButton 
            onClick={handleRefresh} 
            icon={RefreshCw} 
            label=""
            className={isRefreshing ? 'animate-spin' : ''} 
          />
          <RetroButton icon={Plus} label="New Entry" variant="primary" />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RetroCard title="Daily Brief" accentColor="stone" className="lg:col-span-2">
          <textarea 
            className="w-full h-full min-h-[100px] bg-stone-50 border-2 border-stone-900 rounded p-2 text-sm font-bold resize-none focus:outline-none focus:border-stone-500"
            defaultValue="Focus on finishing the core foundation of NEXUS today."
            style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}
          />
        </RetroCard>

        <RetroCard title="Pomodoro Shortcut" icon={Timer} accentColor="orange">
          <div className="flex flex-col items-center justify-center flex-1 space-y-4 py-4">
            <div className="text-4xl font-black font-[family-name:var(--font-space-mono)]">25:00</div>
            <RetroButton label="Start Session" variant="primary" fullWidth />
          </div>
        </RetroCard>

        <RetroCard title="Recent Clips" icon={Clipboard} accentColor="amber">
          <div className="space-y-2 mt-2">
            {recentClips.length === 0 ? (
              <p className="text-sm font-bold text-stone-500 text-center py-4">No recent clips</p>
            ) : recentClips.map(clip => (
              <div key={clip.id} className="flex justify-between items-center p-2 border-2 border-stone-900 bg-stone-50 rounded">
                <span className="text-sm font-bold truncate flex-1 mr-2">
                  {clip.type === 'image' ? 'Image Data' : clip.content}
                </span>
                <RetroBadge color={clip.type === 'url' ? 'sky' : 'amber'}>{clip.type}</RetroBadge>
              </div>
            ))}
          </div>
          <Link href="/clipboard" className="mt-4 block w-full">
            <RetroButton label="View All" variant="primary" fullWidth />
          </Link>
        </RetroCard>

        <RetroCard title="Latest Media" icon={ImageIcon} accentColor="fuchsia">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {recentMedia.length === 0 ? (
              <div className="col-span-2 text-sm font-bold text-stone-500 text-center py-4">No media uploaded</div>
            ) : recentMedia.map(media => (
              <div key={media.id} className="aspect-square bg-stone-200 border-2 border-stone-900 rounded flex items-center justify-center overflow-hidden">
                {media.thumbnail_url ? (
                  <img src={media.thumbnail_url} alt={media.file_name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-stone-500" />
                )}
              </div>
            ))}
          </div>
          <Link href="/media" className="mt-4 block w-full">
            <RetroButton label="View Gallery" variant="primary" fullWidth />
          </Link>
        </RetroCard>

        <RetroCard title="Saved Links" icon={Link2} accentColor="sky">
           <div className="space-y-2 mt-2">
            {recentUrls.length === 0 ? (
              <p className="text-sm font-bold text-stone-500 text-center py-4">No saved links</p>
            ) : recentUrls.map(url => (
              <a key={url.id} href={url.content.startsWith('http') ? url.content : `https://${url.content}`} target="_blank" rel="noreferrer" className="flex flex-col p-2 border-2 border-stone-900 bg-stone-50 rounded hover:bg-sky-100 transition-colors">
                <span className="text-sm font-bold truncate text-sky-700">{url.content}</span>
                <span className="text-xs text-stone-500 mt-1">From: {url.device_source}</span>
              </a>
            ))}
          </div>
        </RetroCard>
      </div>
    </div>
  );
}
