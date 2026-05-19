<script lang="ts">
  let { data } = $props();
</script>

<main class="mx-auto max-w-3xl px-6 py-20">
  <p class="text-fg-3 text-sm mb-4 tracking-wide uppercase">Chohee</p>
  <h1 class="text-4xl md:text-5xl font-semibold leading-tight">
    가사가 음악이 되는 공간.
  </h1>
  <p class="mt-6 text-fg-2 text-lg max-w-xl">
    AI와 사람의 손으로 만든 음악을 공유하고, 누군가의 가사에 음악을 입혀 제안하세요.
    가사 작성자는 마음에 드는 후보를 골라 공식 음원으로 채택합니다.
  </p>

  <div class="mt-10 flex gap-3">
    {#if data.user}
      <a
        href="/me"
        class="inline-flex items-center rounded-md bg-accent text-accent-fg px-5 py-2.5 text-sm font-medium hover:opacity-90"
      >
        내 보관함으로
      </a>
    {:else}
      <a
        href="/login"
        class="inline-flex items-center rounded-md bg-accent text-accent-fg px-5 py-2.5 text-sm font-medium hover:opacity-90"
      >
        시작하기
      </a>
    {/if}
    <a
      href="/discover"
      class="inline-flex items-center rounded-md border border-bd-2 px-5 py-2.5 text-sm font-medium text-fg-1 hover:bg-bg-2"
    >
      둘러보기
    </a>
  </div>

  <p class="mt-16 text-fg-4 text-xs">
    Phase 1 스캐폴드 — SvelteKit + Cloudflare Pages. 디자인 시스템 통합 진행 중.
  </p>
</main>
