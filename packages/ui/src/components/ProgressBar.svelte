<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    value: number; // 0..1
    indeterminate?: boolean;
    tone?: 'accent' | 'info' | 'success';
    label?: string;
    class?: string;
  }

  let { value, indeterminate = false, tone = 'accent', label, class: klass = '' }: Props = $props();
  const pct = $derived(Math.max(0, Math.min(1, value)) * 100);
  const TONE = { accent: 'bg-accent', info: 'bg-info', success: 'bg-success' };
</script>

<div class={cn('w-full', klass)}>
  {#if label}
    <div class="text-fg-3 mb-1 flex justify-between text-xs">
      <span>{label}</span>
      {#if !indeterminate}<span>{Math.round(pct)}%</span>{/if}
    </div>
  {/if}
  <div class="bg-bg-3 h-1.5 w-full overflow-hidden rounded-pill">
    {#if indeterminate}
      <div class={cn('h-full w-1/3 animate-pulse-soft', TONE[tone])}></div>
    {:else}
      <div
        class={cn('h-full transition-all', TONE[tone])}
        style:width="{pct}%"
      ></div>
    {/if}
  </div>
</div>
