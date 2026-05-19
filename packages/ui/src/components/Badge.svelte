<script lang="ts" module>
  export type BadgeTone = 'neutral' | 'accent' | 'info' | 'success' | 'warn' | 'danger';
</script>

<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    tone?: BadgeTone;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { tone = 'neutral', class: klass = '', children }: Props = $props();

  const TONE: Record<BadgeTone, string> = {
    neutral: 'bg-bg-3 text-fg-2 border-bd-1',
    accent: 'bg-accent/15 text-accent border-accent/30',
    info: 'bg-info/15 text-info border-info/30',
    success: 'bg-success/15 text-success border-success/30',
    warn: 'bg-warn/15 text-warn border-warn/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
  };
</script>

<span
  class={cn(
    'inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 text-[11px] font-medium',
    TONE[tone],
    klass,
  )}
>
  {@render children?.()}
</span>
