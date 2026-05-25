'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Clipboard, Image, FolderOpen, 
  BookOpen, Link2, Timer, BarChart2, Lock, Bot 
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",  path: "/dashboard",  color: "text-stone-400", activeColor: "text-stone-100", activeBg: "bg-stone-800" },
  { icon: Clipboard,       label: "Clipboard",  path: "/clipboard",  color: "text-amber-400", activeColor: "text-amber-400", activeBg: "bg-stone-800" },
  { icon: Image,           label: "Media",      path: "/media",      color: "text-fuchsia-400", activeColor: "text-fuchsia-400", activeBg: "bg-stone-800" },
  { icon: FolderOpen,      label: "Files",      path: "/files",      color: "text-cyan-400", activeColor: "text-cyan-400", activeBg: "bg-stone-800" },
  { icon: BookOpen,        label: "Notes",      path: "/notes",      color: "text-lime-400", activeColor: "text-lime-400", activeBg: "bg-stone-800" },
  { icon: Link2,           label: "Resources",  path: "/resources",  color: "text-sky-400", activeColor: "text-sky-400", activeBg: "bg-stone-800" },
  { icon: Timer,           label: "Focus",      path: "/focus",      color: "text-orange-400", activeColor: "text-orange-400", activeBg: "bg-stone-800" },
  { icon: BarChart2,       label: "Analytics",  path: "/analytics",  color: "text-violet-400", activeColor: "text-violet-400", activeBg: "bg-stone-800" },
  { icon: Lock,            label: "Vault",      path: "/vault",      color: "text-red-400", activeColor: "text-red-400", activeBg: "bg-stone-800" },
  { icon: Bot,             label: "Claw",       path: "/claw",       color: "text-emerald-400", activeColor: "text-emerald-400", activeBg: "bg-stone-800" },
];

export const RetroSidebar = () => {
  const pathname = usePathname() || '';

  return (
    <aside className="w-64 bg-stone-900 border-r-4 border-stone-950 flex flex-col h-screen">
      <div className="p-4 border-b-4 border-stone-950 flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-400 border-2 border-stone-950 rounded flex items-center justify-center">
          <Bot size={20} className="text-stone-900" />
        </div>
        <h1 className="font-[family-name:var(--font-space-mono)] font-black text-xl text-stone-100 tracking-widest">
          NEXUS
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded border-2 font-[family-name:var(--font-space)] font-bold transition-colors",
                isActive 
                  ? `${item.activeBg} border-stone-950 ${item.activeColor}` 
                  : `border-transparent text-stone-400 hover:bg-stone-800 hover:border-stone-950 hover:${item.activeColor}`
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t-4 border-stone-950">
        <div className="text-xs font-[family-name:var(--font-space-mono)] text-stone-500 uppercase tracking-wider text-center">
          v1.0.0
        </div>
      </div>
    </aside>
  );
};
