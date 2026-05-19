<script lang="ts">
  import { cn } from '../utils';

  interface Props {
    text: string;
    size?: 'md' | 'lg' | 'xl';
    class?: string;
  }

  let { text, size = 'md', class: klass = '' }: Props = $props();

  const sizeClass = $derived(size === 'xl' ? 'lyrics--xl' : size === 'lg' ? 'lyrics--lg' : '');

  // 빈 줄 두 번 이상을 stanza 구분자로 본다.
  const stanzas = $derived(text.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean));
</script>

<div class={cn('lyrics', sizeClass, klass)}>
  {#each stanzas as stanza, i (i)}
    <p class="stanza">
      {#each stanza.split('\n') as line, j (j)}
        <span class="verse">{line}</span>
      {/each}
    </p>
  {/each}
</div>
