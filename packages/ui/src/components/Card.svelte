<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    surface?: 1 | 2 | 3;
    bordered?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    padding = 'md',
    surface = 1,
    bordered = true,
    class: klass = '',
    children,
  }: Props = $props();

  const SURFACE = { 1: 'bg-bg-1', 2: 'bg-bg-2', 3: 'bg-bg-3' } as const;
  const PAD = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' } as const;
</script>

<div
  class={cn('rounded-lg', SURFACE[surface], PAD[padding], bordered && 'border border-bd-1', klass)}
>
  {@render children?.()}
</div>
