import type { ReactNode } from 'react';
import { cn } from '../utils';

interface TopBarProps {
  leftSlot?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TopBar({ leftSlot, search, actions, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 w-full items-center gap-3 border-b border-bd-1 bg-bg-0/80 px-4 backdrop-blur-glass sm:gap-6 sm:px-6',
        className,
      )}
    >
      {leftSlot && <div className="flex items-center">{leftSlot}</div>}
      <div className="flex w-full max-w-[480px] items-center">{search}</div>
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </header>
  );
}
