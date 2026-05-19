<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    selected?: boolean;
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    type?: 'button' | 'submit';
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    selected = false,
    disabled = false,
    onclick,
    type = 'button',
    class: klass = '',
    children,
  }: Props = $props();
</script>

<button
  {type}
  {disabled}
  {onclick}
  aria-pressed={selected}
  class={cn(
    'inline-flex items-center gap-1 rounded-pill border px-3 py-1 text-xs transition',
    selected
      ? 'bg-accent/15 text-accent border-accent/40'
      : 'bg-bg-2 text-fg-2 border-bd-1 hover:bg-bg-3',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    klass,
  )}
>
  {@render children?.()}
</button>
