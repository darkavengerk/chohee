import { cn } from '../utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  tone?: 'accent' | 'success' | 'warn';
  className?: string;
}

const toneFills = {
  accent: 'bg-accent',
  success: 'bg-success',
  warn: 'bg-warn',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  tone = 'accent',
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = (clamped / max) * 100;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-[11px] text-fg-3">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-pill bg-bg-3"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemax={max}
        aria-valuemin={0}
      >
        <div
          className={cn('h-full rounded-pill transition-all duration-slow', toneFills[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
