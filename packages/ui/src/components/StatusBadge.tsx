import { cn } from '../utils';

export type MusicGenerationStatus = 'waiting' | 'generating' | 'complete' | 'revision';

interface StatusBadgeProps {
  status: MusicGenerationStatus;
  className?: string;
}

const statusLabels: Record<MusicGenerationStatus, string> = {
  waiting: '음악 대기 중',
  generating: '생성 중',
  complete: '완성',
  revision: '보완 요청',
};

const statusStyles: Record<MusicGenerationStatus, string> = {
  waiting:
    'border-status-waiting/30 bg-status-waiting/10 text-status-waiting',
  generating:
    'border-status-generating/30 bg-status-generating/10 text-status-generating',
  complete:
    'border-status-complete/30 bg-status-complete/10 text-status-complete',
  revision:
    'border-status-revision/30 bg-status-revision/10 text-status-revision',
};

const dotColors: Record<MusicGenerationStatus, string> = {
  waiting: 'bg-status-waiting',
  generating: 'bg-status-generating',
  complete: 'bg-status-complete',
  revision: 'bg-status-revision',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-[11px] font-medium',
        statusStyles[status],
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-pill',
          dotColors[status],
          status === 'generating' && 'animate-pulse-soft',
        )}
        aria-hidden
      />
      {statusLabels[status]}
    </span>
  );
}
