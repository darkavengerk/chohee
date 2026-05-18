import { cn } from '../utils';

interface CoverArtProps {
  src?: string;
  alt?: string;
  seed?: string;
  className?: string;
  rounded?: 'md' | 'lg';
}

function seedToHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

export function CoverArt({ src, alt = '', seed = 'chohee', className, rounded = 'md' }: CoverArtProps) {
  const radius = rounded === 'lg' ? 'rounded-lg' : 'rounded-md';
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn('aspect-square w-full object-cover border border-bd-1', radius, className)}
      />
    );
  }
  const h1 = seedToHue(seed);
  const h2 = (h1 + 40) % 360;
  return (
    <div
      className={cn('aspect-square w-full border border-bd-1', radius, className)}
      style={{
        background: `linear-gradient(135deg, oklch(0.4 0.06 ${h1}) 0%, oklch(0.28 0.05 ${h2}) 100%)`,
      }}
      aria-label={alt || 'Cover'}
    />
  );
}
