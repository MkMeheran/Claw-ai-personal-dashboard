import { ReactNode } from 'react';
import { shadows, cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  accentColor?: string;
}

export const RetroModal = ({
  isOpen,
  onClose,
  title,
  children,
  accentColor = 'stone'
}: RetroModalProps) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-stone-100 border-[3px] border-stone-900 rounded-lg w-full max-w-lg flex flex-col"
        style={{ boxShadow: shadows.nesRaised }}
      >
        <div className={cn(
          "px-4 py-3 border-b-2 border-stone-900 flex justify-between items-center",
          headerBg
        )}>
          <h2 className={cn("font-[family-name:var(--font-space-mono)] font-black uppercase text-sm", titleColor)}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className={cn("hover:opacity-70 transition-opacity", titleColor)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-3 font-[family-name:var(--font-space)]">
          {children}
        </div>
      </div>
    </div>
  );
};
