<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    name?: string;
    value?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    serif?: boolean;
    class?: string;
    oninput?: (e: Event) => void;
  }

  let {
    name,
    value = $bindable(''),
    placeholder,
    rows = 4,
    required,
    disabled,
    invalid,
    serif = false,
    class: klass = '',
    oninput,
  }: Props = $props();
</script>

<textarea
  {name}
  {placeholder}
  {rows}
  {required}
  {disabled}
  bind:value
  {oninput}
  aria-invalid={invalid ? 'true' : undefined}
  class={cn(
    'block w-full rounded-md border px-3 py-2 text-sm leading-relaxed',
    'bg-bg-2 text-fg-1 placeholder:text-fg-4',
    invalid ? 'border-danger' : 'border-bd-1',
    'focus:border-accent focus:outline-none',
    'disabled:opacity-50',
    serif && 'serif text-base',
    klass,
  )}
></textarea>
