<script lang="ts">
  interface Props {
    href?: string;
  }
  let { href = '/' }: Props = $props();
</script>

<a {href} class="inline-flex items-center gap-2">
  <span
    class="bg-accent text-accent-fg inline-flex h-7 w-7 items-center justify-center rounded-md font-serif text-base"
    aria-hidden="true"
  >
    초
  </span>
  <span class="text-fg-1 text-sm font-medium tracking-tight">Chohee</span>
</a>
