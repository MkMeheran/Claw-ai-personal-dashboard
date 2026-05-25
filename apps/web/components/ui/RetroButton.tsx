import { ButtonHTMLAttributes } from 'react';
import { shadows, cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  label: string;
  variant?: 'primary' | 'danger' | 'success' | 'info' | 'purple' | 'stone';
  fullWidth?: boolean;
}

const variantConfig = {
  primary: { bg: 'bg-amber-400', hover: 'hover:bg-amber-300', shadow: shadows.nesRaised },
  danger: { bg: 'bg-red-500', hover: 'hover:bg-red-400', shadow: shadows.nesDanger, text: 'text-white' },
  success: { bg: 'bg-lime-400', hover: 'hover:bg-lime-300', shadow: shadows.nesSuccess },
  info: { bg: 'bg-cyan-400', hover: 'hover:bg-cyan-300', shadow: shadows.nesInfo },
  purple: { bg: 'bg-fuchsia-400', hover: 'hover:bg-fuchsia-300', shadow: shadows.nesPurple },
  stone: { bg: 'bg-stone-300', hover: 'hover:bg-stone-200', shadow: shadows.nesRaised },
};

export const RetroButton = ({
  icon: Icon,
  label,
  variant = 'primary',
  fullWidth,
  className,
  ...props
}: RetroButtonProps) => {
  const config = variantConfig[variant];
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2 text-sm font-black border-2 border-stone-900 rounded",
        "font-[family-name:var(--font-space-mono)] uppercase tracking-wider",
        "active:translate-y-0.5 transition-transform duration-100",
        config.bg, config.hover, config.text || 'text-stone-900',
        fullWidth ? "w-full" : "",
        className
      )}
      style={{ boxShadow: config.shadow }}
      {...props}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
};
