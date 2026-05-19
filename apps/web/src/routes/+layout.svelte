<script lang="ts">
  import '../app.css';

  let { children, data } = $props();
</script>

<svelte:head>
  <title>Chohee — 가사가 음악이 되는 공간</title>
</svelte:head>

<div class="min-h-screen bg-bg-0 text-fg-1">
  {@render children?.()}
</div>
