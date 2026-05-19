<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    accept?: string;
    multiple?: boolean;
    hint?: string;
    disabled?: boolean;
    class?: string;
    onfiles: (files: File[]) => void;
    children?: import('svelte').Snippet;
  }

  let {
    accept,
    multiple = false,
    hint = '파일을 드래그하거나 클릭해서 선택',
    disabled = false,
    class: klass = '',
    onfiles,
    children,
  }: Props = $props();

  let dragOver = $state(false);
  let inputEl: HTMLInputElement | undefined = $state();

  function emit(list: FileList | null): void {
    if (!list || list.length === 0) return;
    onfiles(Array.from(list));
  }

  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    dragOver = false;
    if (disabled) return;
    emit(e.dataTransfer?.files ?? null);
  }
</script>

<label
  class={cn(
    'flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition',
    dragOver ? 'border-accent bg-accent/5' : 'border-bd-2 hover:border-accent hover:bg-bg-1',
    disabled && 'pointer-events-none opacity-50',
    klass,
  )}
  ondragover={(e) => {
    e.preventDefault();
    dragOver = true;
  }}
  ondragleave={() => (dragOver = false)}
  ondrop={handleDrop}
>
  <input
    bind:this={inputEl}
    type="file"
    {accept}
    {multiple}
    class="hidden"
    onchange={(e) => emit((e.currentTarget as HTMLInputElement).files)}
  />
  {#if children}
    {@render children()}
  {:else}
    <p class="text-fg-2 text-sm">{hint}</p>
    {#if accept}
      <p class="text-fg-4 text-xs">{accept.replace(/audio\//g, '').replace(/,/g, ' · ')}</p>
    {/if}
  {/if}
</label>
