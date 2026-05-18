import type { ReactNode } from 'react';
import { cn } from '../utils';
import { Badge } from './Badge';
import { CoverArt } from './CoverArt';
import { StatusBadge, type MusicGenerationStatus } from './StatusBadge';

interface SongCardProps {
  id: string;
  title: string;
  artist: string;
  coverSrc?: string;
  durationLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function SongCard({
  id,
  title,
  artist,
  coverSrc,
  durationLabel,
  onClick,
  className,
}: SongCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col gap-3 rounded-lg p-3 text-left transition duration-base hover:bg-bg-1',
        className,
      )}
    >
      <CoverArt src={coverSrc} seed={id} alt={`${title} 커버`} rounded="lg" />
      <div className="flex flex-col gap-0.5">
        <p className="font-serif text-[16px] leading-snug text-fg-1 group-hover:text-accent">
          {title}
        </p>
        <p className="text-[12px] text-fg-3">
          {artist}
          {durationLabel ? ` · ${durationLabel}` : ''}
        </p>
      </div>
    </button>
  );
}

interface LyricsCardProps {
  id: string;
  title: string;
  author: string;
  status: MusicGenerationStatus;
  preview: string;
  lineCount?: number;
  onClick?: () => void;
  className?: string;
}

export function LyricsCard({
  title,
  author,
  status,
  preview,
  lineCount,
  onClick,
  className,
}: LyricsCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-bd-1 bg-bg-1 p-5 text-left transition duration-base hover:border-bd-2 hover:shadow-2',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <StatusBadge status={status} />
        {lineCount !== undefined && (
          <span className="mono text-[10.5px] text-fg-4">{lineCount} lines</span>
        )}
      </div>
      <p className="lyrics line-clamp-5 text-[16px] leading-[1.8] text-fg-2">{preview}</p>
      <div className="mt-auto flex flex-col gap-0.5">
        <p className="font-serif text-[16px] text-fg-1">{title}</p>
        <p className="text-[12px] text-fg-3">{author}</p>
      </div>
    </button>
  );
}

interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  trackCount: number;
  concept?: string;
  coverSrc?: string;
  badgeSlot?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function AlbumCard({
  id,
  title,
  artist,
  trackCount,
  concept,
  coverSrc,
  badgeSlot,
  onClick,
  className,
}: AlbumCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col gap-3 rounded-lg p-3 text-left transition duration-base hover:bg-bg-1',
        className,
      )}
    >
      <div className="relative">
        <CoverArt src={coverSrc} seed={id} alt={`${title} 커버`} rounded="lg" />
        <div className="absolute left-2 top-2">
          {badgeSlot ?? (
            <Badge tone="neutral" className="bg-black/40 backdrop-blur-sm">
              ALBUM · {trackCount}곡
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-serif text-[16px] leading-snug text-fg-1 group-hover:text-accent">
          {title}
        </p>
        <p className="text-[12px] text-fg-3">{artist}</p>
        {concept && (
          <p className="mt-1 line-clamp-2 text-[12px] italic text-fg-3">&ldquo;{concept}&rdquo;</p>
        )}
      </div>
    </button>
  );
}
