'use client';
import { useMemo } from 'react';
import { cn } from '../utils';

interface WaveformProps {
  durationSeconds: number;
  positionSeconds?: number;
  peaks?: number[];
  bars?: number;
  onSeek?: (seconds: number) => void;
  playing?: boolean;
  className?: string;
}

function pseudoPeaks(count: number, seed: number): number[] {
  const out: number[] = [];
  let state = seed || 1;
  for (let i = 0; i < count; i++) {
    state = (state * 9301 + 49297) % 233280;
    const r = state / 233280;
    out.push(0.25 + r * 0.75);
  }
  return out;
}

export function Waveform({
  durationSeconds,
  positionSeconds = 0,
  peaks,
  bars = 92,
  onSeek,
  playing = false,
  className,
}: WaveformProps) {
  const data = useMemo(() => peaks ?? pseudoPeaks(bars, durationSeconds), [peaks, bars, durationSeconds]);
  const ratio = durationSeconds > 0 ? Math.min(positionSeconds / durationSeconds, 1) : 0;
  const playedIdx = Math.floor(ratio * data.length);
  return (
    <div
      className={cn('flex h-14 w-full items-end gap-[2px]', onSeek && 'cursor-pointer', className)}
      onClick={(e) => {
        if (!onSeek) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        onSeek(pct * durationSeconds);
      }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={durationSeconds}
      aria-valuenow={positionSeconds}
    >
      {data.map((h, i) => {
        const isPlayed = i < playedIdx;
        const isHead = i === playedIdx && playing;
        return (
          <span
            key={i}
            className={cn(
              'w-[3px] origin-bottom rounded-pill transition-colors',
              isPlayed ? 'bg-accent' : 'bg-bd-2',
              isHead && 'animate-wave bg-accent',
            )}
            style={{ height: `${Math.max(4, h * 56)}px` }}
          />
        );
      })}
    </div>
  );
}
