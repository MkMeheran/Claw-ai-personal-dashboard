import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroBadge } from '@/components/ui/RetroBadge';
import { 
  Timer, Clipboard, Image as ImageIcon, Link2, Plus 
} from 'lucide-react';

export default function DashboardPage() {
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
        <RetroButton icon={Plus} label="New Entry" variant="primary" />
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
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-2 border-2 border-stone-900 bg-stone-50 rounded">
                <span className="text-sm font-bold truncate flex-1 mr-2">https://github.com/nexus</span>
                <RetroBadge color="amber">URL</RetroBadge>
              </div>
            ))}
          </div>
        </RetroCard>

        <RetroCard title="Latest Media" icon={ImageIcon} accentColor="fuchsia">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map(i => (
              <div key={i} className="aspect-video bg-stone-300 border-2 border-stone-900 rounded flex items-center justify-center">
                <ImageIcon className="text-stone-500" />
              </div>
            ))}
          </div>
        </RetroCard>

        <RetroCard title="Saved Links" icon={Link2} accentColor="sky">
           <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="flex flex-col p-2 border-2 border-stone-900 bg-stone-50 rounded">
                <span className="text-sm font-bold truncate">Next.js Documentation</span>
                <span className="text-xs text-stone-500">Technology</span>
              </div>
            ))}
          </div>
        </RetroCard>
      </div>
    </div>
  );
}
