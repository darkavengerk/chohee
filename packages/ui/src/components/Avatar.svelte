<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: number;
    class?: string;
  }

  let { src, alt, name, size = 40, class: klass = '' }: Props = $props();
  const initial = $derived(((name ?? alt ?? '?').trim() || '?').slice(0, 1).toUpperCase());
</script>

{#if src}
  <img
    {src}
    alt={alt ?? name ?? ''}
    style:width="{size}px"
    style:height="{size}px"
    class={cn('bg-bg-3 rounded-full object-cover', klass)}
  />
{:else}
  <div
    style:width="{size}px"
    style:height="{size}px"
    class={cn(
      'bg-bg-3 text-fg-2 inline-flex items-center justify-center rounded-full font-medium',
      klass,
    )}
    style:font-size="{Math.max(11, Math.floor(size * 0.4))}px"
    aria-label={alt ?? name ?? 'avatar'}
  >
    {initial}
  </div>
{/if}
