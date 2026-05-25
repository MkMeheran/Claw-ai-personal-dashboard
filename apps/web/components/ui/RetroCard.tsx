import { shadows, cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface RetroCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  accentColor?: string; // e.g., 'amber', 'fuchsia', etc.
  className?: string;
}

export const RetroCard = ({
  title,
  icon: Icon,
  children,
  accentColor = 'stone',
  className
}: RetroCardProps) => {
  const headerBgMap: Record<string, string> = {
    amber: 'bg-amber-400',
    fuchsia: 'bg-fuchsia-400',
    cyan: 'bg-cyan-400',
    lime: 'bg-lime-400',
    orange: 'bg-orange-400',
    sky: 'bg-sky-400',
    violet: 'bg-violet-400',
    red: 'bg-red-600',
    emerald: 'bg-emerald-400',
    stone: 'bg-stone-900',
  };

  const headerBg = headerBgMap[accentColor] || 'bg-stone-300';
  const isDarkHeader = accentColor === 'stone' || accentColor === 'red';
  const titleColor = isDarkHeader ? 'text-stone-100' : 'text-stone-900';

  return (
    <div
      className={cn("bg-stone-100 border-[3px] border-stone-900 rounded-lg overflow-hidden flex flex-col", className)}
      style={{ boxShadow: shadows.nesRaised }}
    >
      <div className={cn(
        "px-4 py-2 border-b-2 border-stone-900 flex items-center gap-2",
        headerBg
      )}>
        {Icon && <Icon size={16} className={titleColor} />}
        <h2 className={cn("font-[family-name:var(--font-space-mono)] font-black uppercase text-sm", titleColor)}>
          {title}
        </h2>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
