import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'success' | 'warn' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-bg-3 text-fg-2 border-bd-1',
  accent: 'bg-accent-soft text-accent border-accent/30',
  info: 'bg-info/10 text-info border-info/30',
  success: 'bg-success/10 text-success border-success/30',
  warn: 'bg-warn/10 text-warn border-warn/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
};

export function Badge({
  className,
  tone = 'neutral',
  icon,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-[11px] font-medium',
        toneClasses[tone],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
