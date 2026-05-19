<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    peaks: number[]; // 0..1 정규화된 값들
    progress?: number; // 0..1
    height?: number;
    bars?: number; // 표시할 막대 개수 (peaks를 다운샘플)
    class?: string;
  }

  let { peaks, progress = 0, height = 56, bars = 92, class: klass = '' }: Props = $props();

  const downsampled = $derived(downsample(peaks, bars));
  const cursor = $derived(Math.max(0, Math.min(1, progress)) * bars);

  function downsample(input: number[], target: number): number[] {
    if (input.length === 0) return Array.from({ length: target }, () => 0);
    if (input.length <= target) return input;
    const step = input.length / target;
    const out: number[] = [];
    for (let i = 0; i < target; i++) {
      const a = Math.floor(i * step);
      const b = Math.floor((i + 1) * step);
      let m = 0;
      for (let j = a; j < b; j++) if (input[j]! > m) m = input[j]!;
      out.push(m);
    }
    return out;
  }
</script>

<div
  class={cn('flex items-end gap-[2px] w-full', klass)}
  style:height="{height}px"
  role="img"
  aria-label="파형"
>
  {#each downsampled as v, i (i)}
    {@const h = Math.max(0.06, v)}
    {@const past = i < cursor}
    <div
      class={cn('flex-1 rounded-[1px] transition-colors', past ? 'bg-accent' : 'bg-bd-2')}
      style:height="{Math.round(h * height)}px"
    ></div>
  {/each}
</div>
