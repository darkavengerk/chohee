import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

const sizes = {
  sm: 'h-6 px-2.5 text-[11px]',
  md: 'h-7 px-3 text-[12px]',
  lg: 'h-9 px-4 text-[13px]',
};

export function Chip({
  className,
  active = false,
  size = 'md',
  icon,
  children,
  type = 'button',
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border font-medium transition duration-fast',
        sizes[size],
        active
          ? 'border-accent/40 bg-accent-soft text-accent'
          : 'border-bd-1 bg-bg-2 text-fg-2 hover:bg-bg-3 hover:text-fg-1',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
