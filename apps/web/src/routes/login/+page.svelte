<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();
</script>

<svelte:head>
  <title>로그인 — Chohee</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-20">
  <a href="/" class="text-fg-3 text-sm hover:text-fg-1 mb-10">← 홈으로</a>

  <h1 class="text-3xl font-semibold">시작하기</h1>
  <p class="text-fg-2 mt-3">
    가사를 올리거나, 누군가의 가사에 음악을 입혀 제안하려면 로그인이 필요합니다.
  </p>

  {#if data.errorCode}
    <p
      class="bg-danger/10 text-danger border-danger/30 mt-6 rounded-md border px-4 py-3 text-sm"
    >
      {errorMessage(data.errorCode)}
    </p>
  {/if}

  <div class="mt-10 space-y-3">
    {#if data.kakaoAuthorizeUrl}
      <a
        href={appendNext(data.kakaoAuthorizeUrl, data.next)}
        class="flex w-full items-center justify-center gap-2 rounded-md bg-[#fee500] py-3 font-medium text-[#191600] hover:opacity-90"
      >
        카카오로 계속하기
      </a>
    {:else}
      <p class="text-fg-3 text-sm">
        카카오 OAuth 설정이 비어 있습니다. 운영자에게 문의하거나 dev-login을 사용하세요.
      </p>
    {/if}

    {#if data.devLoginEnabled}
      <div class="border-bd-1 mt-8 rounded-lg border p-5">
        <p class="text-fg-3 text-xs uppercase tracking-wider">개발 전용</p>
        <h2 class="mt-1 text-base font-medium">빠른 로그인 (dev)</h2>
        <p class="text-fg-3 mt-1 text-xs">카카오 없이 stub 사용자로 즉시 진입합니다.</p>

        <form
          method="POST"
          action="?/devLogin"
          use:enhance
          class="mt-4 space-y-3"
        >
          <input type="hidden" name="next" value={data.next} />

          <label class="block">
            <span class="text-fg-3 text-xs">핸들 (영문/숫자/언더스코어)</span>
            <input
              name="handle"
              value="dev_tester"
              class="bg-bg-2 text-fg-1 border-bd-1 mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>

          <label class="block">
            <span class="text-fg-3 text-xs">표시 이름</span>
            <input
              name="displayName"
              value="개발 테스터"
              class="bg-bg-2 text-fg-1 border-bd-1 mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>

          <label class="text-fg-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="isAdmin" value="1" class="accent-accent" />
            관리자 권한 부여
          </label>

          {#if form?.error}
            <p class="text-danger text-sm">{form.error}</p>
          {/if}

          <button
            type="submit"
            class="bg-accent text-accent-fg w-full rounded-md py-2.5 text-sm font-medium hover:opacity-90"
          >
            dev-login
          </button>
        </form>
      </div>
    {/if}
  </div>
</main>

<script lang="ts" module>
  function appendNext(authorizeUrl: string, next: string): string {
    try {
      const u = new URL(authorizeUrl);
      const existingState = u.searchParams.get('state') ?? '';
      const stateWithNext = `${existingState}|next=${encodeURIComponent(next)}`;
      u.searchParams.set('state', stateWithNext);
      return u.toString();
    } catch {
      return authorizeUrl;
    }
  }

  function errorMessage(code: string): string {
    switch (code) {
      case 'kakao_denied':
        return '카카오 로그인이 취소되었습니다.';
      case 'kakao_failed':
        return '카카오 인증에 실패했습니다. 잠시 후 다시 시도해주세요.';
      case 'missing_code':
        return '인증 코드가 누락되었습니다.';
      default:
        return '로그인 중 문제가 발생했습니다.';
    }
  }
</script>
