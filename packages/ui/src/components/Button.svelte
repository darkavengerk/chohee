<script lang="ts" module>
  export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  export type ButtonSize = 'sm' | 'md' | 'lg';

  const VARIANT: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-accent-fg hover:brightness-110 active:brightness-95',
    secondary: 'bg-bg-2 text-fg-1 hover:bg-bg-3 border border-bd-1',
    outline: 'bg-transparent text-fg-1 border border-bd-2 hover:bg-bg-2',
    ghost: 'bg-transparent text-fg-2 hover:bg-bg-2 hover:text-fg-1',
    danger: 'bg-transparent text-danger border border-danger/40 hover:bg-danger/10',
  };
  const SIZE: Record<ButtonSize, string> = {
    sm: 'h-7 px-3 text-xs',
    md: 'h-9 px-4 text-[13px]',
    lg: 'h-11 px-5 text-sm',
  };
</script>

<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    href?: string;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    href,
    class: klass = '',
    onclick,
    children,
  }: Props = $props();

  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium ' +
    'transition select-none whitespace-nowrap ' +
    'disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-accent';
</script>

{#if href}
  <a
    {href}
    class={cn(base, VARIANT[variant], SIZE[size], fullWidth && 'w-full', klass)}
    aria-disabled={disabled || loading}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    {type}
    {onclick}
    disabled={disabled || loading}
    class={cn(base, VARIANT[variant], SIZE[size], fullWidth && 'w-full', klass)}
  >
    {#if loading}
      <span
        class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      ></span>
    {/if}
    {@render children?.()}
  </button>
{/if}
