import type { HTMLAttributes } from 'react';
import { cn } from '../utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  surface?: 1 | 2 | 3;
  interactive?: boolean;
}

export function Card({
  className,
  surface = 1,
  interactive = false,
  children,
  ...rest
}: CardProps) {
  const surfaceClass = surface === 1 ? 'bg-bg-1' : surface === 2 ? 'bg-bg-2' : 'bg-bg-3';
  return (
    <div
      className={cn(
        'rounded-lg border border-bd-1 shadow-1 transition duration-base',
        surfaceClass,
        interactive && 'hover:border-bd-2 hover:shadow-2 cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
