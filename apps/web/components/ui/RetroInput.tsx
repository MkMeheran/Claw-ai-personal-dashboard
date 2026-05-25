import { InputHTMLAttributes, forwardRef } from 'react';
import { shadows, cn } from '@/lib/utils';

interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(
  ({ className, fullWidth = true, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "px-3 py-2 text-sm font-bold text-stone-900 bg-stone-50",
          "border-2 border-stone-900 rounded focus:outline-none",
          "focus:border-amber-500 placeholder:text-stone-400",
          "font-[family-name:var(--font-space)]",
          fullWidth ? "w-full" : "",
          className
        )}
        style={{ boxShadow: shadows.nesPressed }}
        {...props}
      />
    );
  }
);

RetroInput.displayName = 'RetroInput';
