'use client';
import { useEffect, type ReactNode } from 'react';
import { cn } from '../utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal
    >
      <div
        className={cn(
          'w-[92vw] rounded-lg border border-bd-1 bg-bg-1 p-6 shadow-3',
          sizes[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="font-serif text-[22px] font-medium text-fg-1">{title}</h2>
        )}
        {description && <p className="mt-1 text-[13px] text-fg-3">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
