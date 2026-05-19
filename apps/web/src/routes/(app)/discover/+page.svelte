<script lang="ts">
  import Card from '@chohee/ui/components/Card.svelte';
  import Badge from '@chohee/ui/components/Badge.svelte';

  let { data } = $props();

  function formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  }

  function formatDuration(ms: number | null): string {
    if (!ms) return '';
    const total = Math.round(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<svelte:head>
  <title>둘러보기 — Chohee</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-12">
  <h1 class="text-3xl font-semibold">둘러보기</h1>
  <p class="text-fg-3 mt-2 text-sm">최근 발행된 트랙과 가사. Phase 2에서 추천과 필터가 추가됩니다.</p>

  <section class="mt-10">
    <h2 class="text-lg font-medium">최신 트랙</h2>
    {#if data.tracksError}
      <p class="text-danger mt-2 text-sm">{data.tracksError}</p>
    {:else if data.tracks.length === 0}
      <p class="text-fg-4 mt-2 text-sm">아직 트랙이 없습니다.</p>
    {:else}
      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.tracks as t (t.id)}
          <Card padding="md">
            <p class="text-fg-1 truncate text-sm font-medium">{t.title}</p>
            <p class="text-fg-4 mt-1 text-xs">
              {formatDate(t.createdAt)}
              {#if t.durationMs}· {formatDuration(t.durationMs)}{/if}
            </p>
          </Card>
        {/each}
      </div>
    {/if}
  </section>

  <section class="mt-12">
    <h2 class="text-lg font-medium">음악을 기다리는 가사</h2>
    <p class="text-fg-4 mt-1 text-xs">
      Phase 2에서 다른 사용자가 음악을 제안할 수 있습니다.
    </p>
    {#if data.lyricsError}
      <p class="text-danger mt-2 text-sm">{data.lyricsError}</p>
    {:else if data.lyrics.length === 0}
      <p class="text-fg-4 mt-2 text-sm">아직 가사가 없습니다.</p>
    {:else}
      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.lyrics as l (l.id)}
          <Card padding="md">
            <div class="flex items-start justify-between gap-2">
              <p class="text-fg-1 truncate text-sm font-medium">{l.title}</p>
              {#if l.generationRequestStatus === 'pending'}
                <Badge tone="accent">제안 대기</Badge>
              {/if}
            </div>
            <p class="text-fg-4 mt-1 text-xs">{formatDate(l.createdAt)}</p>
          </Card>
        {/each}
      </div>
    {/if}
  </section>
</div>
