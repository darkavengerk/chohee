<script lang="ts">
  let { data } = $props();
  const me = $derived(data.me);
</script>

<svelte:head>
  <title>마이페이지 — Chohee</title>
</svelte:head>

<main class="mx-auto max-w-3xl px-6 py-16">
  <header class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">마이페이지</h1>
    <form method="POST" action="/auth/logout">
      <button
        type="submit"
        class="text-fg-3 hover:text-fg-1 text-sm transition-colors"
      >
        로그아웃
      </button>
    </form>
  </header>

  <section class="bg-bg-1 border-bd-1 mt-10 rounded-lg border p-6">
    <div class="flex items-center gap-4">
      {#if me.avatarUrl}
        <img
          src={me.avatarUrl}
          alt={me.displayName ?? me.handle}
          class="bg-bg-3 h-16 w-16 rounded-full object-cover"
        />
      {:else}
        <div
          class="bg-bg-3 text-fg-2 flex h-16 w-16 items-center justify-center rounded-full text-xl"
        >
          {(me.displayName ?? me.handle).slice(0, 1)}
        </div>
      {/if}

      <div class="min-w-0 flex-1">
        <p class="truncate text-lg font-medium">{me.displayName ?? me.handle}</p>
        <p class="text-fg-3 truncate text-sm">@{me.handle}</p>
      </div>

      <a
        href="/me/edit"
        class="text-fg-2 border-bd-1 hover:bg-bg-2 rounded-md border px-3 py-1.5 text-sm"
      >
        편집
      </a>
    </div>

    {#if me.bio}
      <p class="text-fg-2 mt-5 whitespace-pre-wrap text-sm">{me.bio}</p>
    {/if}

    <dl class="text-fg-3 mt-6 grid grid-cols-2 gap-3 text-xs">
      {#if me.email}
        <div><dt class="text-fg-4">이메일</dt><dd class="text-fg-2">{me.email}</dd></div>
      {/if}
      <div>
        <dt class="text-fg-4">연결된 로그인</dt>
        <dd class="text-fg-2">{me.providers.join(', ') || '없음'}</dd>
      </div>
      {#if me.isAdmin}
        <div>
          <dt class="text-fg-4">권한</dt>
          <dd class="text-accent">관리자</dd>
        </div>
      {/if}
      <div>
        <dt class="text-fg-4">가입일</dt>
        <dd class="text-fg-2">{new Date(me.createdAt).toLocaleDateString('ko-KR')}</dd>
      </div>
    </dl>
  </section>

  <section class="mt-10">
    <h2 class="text-lg font-medium">내 콘텐츠</h2>
    <p class="text-fg-3 mt-2 text-sm">
      Phase 1 진행 중 — 트랙/가사/앨범 리스트는 곧 추가됩니다.
    </p>

    <div class="mt-6 grid gap-3 sm:grid-cols-3">
      <a
        href="/upload"
        class="border-bd-1 hover:border-accent hover:bg-bg-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors"
      >
        <span class="text-fg-2 text-sm">+ 무언가 올리기</span>
      </a>
    </div>
  </section>
</main>
