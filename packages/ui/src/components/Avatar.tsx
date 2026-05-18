import { cn } from '../utils';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-[13px]',
  lg: 'h-14 w-14 text-[16px]',
  xl: 'h-20 w-20 text-[20px]',
};

function nameToHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export function Avatar({ name = '?', src, size = 'md', className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const hue = nameToHue(name);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn('rounded-pill object-cover border border-bd-1', sizes[size], className)}
      />
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-pill border border-bd-1 font-medium text-accent-fg',
        sizes[size],
        className,
      )}
      style={{ background: `oklch(0.7 0.08 ${hue})` }}
      aria-label={name}
    >
      {initial}
    </span>
  );
}
