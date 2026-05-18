'use client';
import { cn } from '../utils';
import { CoverArt } from './CoverArt';
import { Waveform } from './Waveform';

interface FooterPlayerProps {
  trackId?: string;
  title?: string;
  artist?: string;
  coverSrc?: string;
  durationSeconds: number;
  positionSeconds: number;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seconds: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

export function FooterPlayer({
  trackId,
  title,
  artist,
  coverSrc,
  durationSeconds,
  positionSeconds,
  playing,
  onPlay,
  onPause,
  onSeek,
  onPrev,
  onNext,
  className,
}: FooterPlayerProps) {
  if (!trackId) return null;
  return (
    <div
      className={cn(
        'fixed inset-x-4 bottom-4 z-30 grid grid-cols-[1fr_2fr_1fr] items-center gap-4 rounded-lg border border-bd-1 bg-bg-1/70 px-4 py-3 shadow-3 backdrop-blur-glass',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11">
          <CoverArt src={coverSrc} seed={trackId} alt="" rounded="md" />
        </div>
        <div className="flex min-w-0 flex-col">
          <p className="truncate font-serif text-[14px] text-fg-1">{title}</p>
          <p className="truncate text-[11.5px] text-fg-3">{artist}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          {onPrev && (
            <button
              onClick={onPrev}
              className="text-fg-2 hover:text-fg-1"
              aria-label="이전"
            >
              ◀◀
            </button>
          )}
          <button
            onClick={playing ? onPause : onPlay}
            className="flex h-9 w-9 items-center justify-center rounded-pill bg-accent text-accent-fg"
            aria-label={playing ? '일시정지' : '재생'}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          {onNext && (
            <button
              onClick={onNext}
              className="text-fg-2 hover:text-fg-1"
              aria-label="다음"
            >
              ▶▶
            </button>
          )}
        </div>
        <div className="flex w-full items-center gap-3">
          <span className="mono w-10 text-right text-[10.5px] text-fg-3">
            {fmt(positionSeconds)}
          </span>
          <div className="flex-1">
            <Waveform
              durationSeconds={durationSeconds}
              positionSeconds={positionSeconds}
              playing={playing}
              onSeek={onSeek}
              bars={64}
              className="h-7"
            />
          </div>
          <span className="mono w-10 text-[10.5px] text-fg-3">{fmt(durationSeconds)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 text-fg-3">
        {/* meta-actions slot, intentionally minimal */}
      </div>
    </div>
  );
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
