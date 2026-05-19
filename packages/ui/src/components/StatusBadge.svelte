<script lang="ts" module>
  // 음악 생성 요청 상태에 대응하는 시각 표시.
  export type GenerationStatus =
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'rejected'
    | 'cancelled';

  const META: Record<GenerationStatus, { label: string; ring: string; dot: string }> = {
    pending: { label: '대기', ring: 'border-status-waiting/40 text-status-waiting', dot: 'bg-status-waiting' },
    in_progress: {
      label: '제안 받는 중',
      ring: 'border-status-generating/40 text-status-generating',
      dot: 'bg-status-generating animate-pulse-soft',
    },
    completed: {
      label: '채택됨',
      ring: 'border-status-complete/40 text-status-complete',
      dot: 'bg-status-complete',
    },
    rejected: { label: '거절', ring: 'border-danger/40 text-danger', dot: 'bg-danger' },
    cancelled: { label: '취소', ring: 'border-bd-2 text-fg-3', dot: 'bg-fg-4' },
  };
</script>

<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    status: GenerationStatus;
    class?: string;
  }

  let { status, class: klass = '' }: Props = $props();
  const m = $derived(META[status]);
</script>

<span
  class={cn(
    'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-[11px] font-medium',
    m.ring,
    klass,
  )}
>
  <span class={cn('h-1.5 w-1.5 rounded-full', m.dot)} aria-hidden="true"></span>
  {m.label}
</span>
