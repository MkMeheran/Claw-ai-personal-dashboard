import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface RetroBadgeProps {
  children: ReactNode;
  color?: string; // 'amber', 'fuchsia', etc.
  className?: string;
}

export const RetroBadge = ({ children, color = 'amber', className }: RetroBadgeProps) => {
  const bgMap: Record<string, string> = {
    amber: 'bg-amber-500 text-stone-900',
    fuchsia: 'bg-fuchsia-500 text-stone-100',
    cyan: 'bg-cyan-600 text-stone-100',
    lime: 'bg-lime-600 text-stone-100',
    orange: 'bg-orange-500 text-stone-900',
    sky: 'bg-sky-600 text-stone-100',
    violet: 'bg-violet-600 text-stone-100',
    red: 'bg-red-700 text-stone-100',
    emerald: 'bg-emerald-600 text-stone-100',
    stone: 'bg-stone-700 text-stone-100',
  };

  const bg = bgMap[color] || 'bg-stone-500 text-stone-100';

  return (
    <span className={cn(
      "px-2 py-0.5 text-xs font-black uppercase border-2 border-stone-900 rounded",
      "font-[family-name:var(--font-space-mono)]",
      bg,
      className
    )}>
      {children}
    </span>
  );
};
