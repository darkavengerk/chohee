<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    title?: string;
    class?: string;
    left?: import('svelte').Snippet;
    right?: import('svelte').Snippet;
  }

  let { title, class: klass = '', left, right }: Props = $props();
</script>

<header
  class={cn(
    'border-bd-1 bg-bg-0/80 backdrop-blur-glass sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-5',
    klass,
  )}
>
  <div class="flex items-center gap-3">
    {@render left?.()}
    {#if title}
      <h1 class="text-fg-1 text-sm font-medium">{title}</h1>
    {/if}
  </div>
  <div class="ml-auto flex items-center gap-2">
    {@render right?.()}
  </div>
</header>
