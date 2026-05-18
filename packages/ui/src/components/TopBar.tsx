import type { ReactNode } from 'react';
import { cn } from '../utils';

interface TopBarProps {
  search?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TopBar({ search, actions, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 w-full items-center gap-6 border-b border-bd-1 bg-bg-0/80 px-6 backdrop-blur-glass',
        className,
      )}
    >
      <div className="flex max-w-[480px] flex-1 items-center">{search}</div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  );
}
