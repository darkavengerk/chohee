<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    type?: 'text' | 'email' | 'url' | 'password' | 'search';
    name?: string;
    value?: string;
    placeholder?: string;
    autocomplete?: HTMLInputElement['autocomplete'];
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    class?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  }

  let {
    type = 'text',
    name,
    value = $bindable(''),
    placeholder,
    autocomplete,
    required,
    disabled,
    readonly,
    invalid,
    class: klass = '',
    oninput,
    onchange,
  }: Props = $props();
</script>

<input
  {type}
  {name}
  {placeholder}
  {autocomplete}
  {required}
  {disabled}
  {readonly}
  bind:value
  {oninput}
  {onchange}
  aria-invalid={invalid ? 'true' : undefined}
  class={cn(
    'block w-full rounded-md border px-3 py-2 text-sm',
    'bg-bg-2 text-fg-1 placeholder:text-fg-4',
    invalid ? 'border-danger' : 'border-bd-1',
    'focus:border-accent focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    klass,
  )}
/>
