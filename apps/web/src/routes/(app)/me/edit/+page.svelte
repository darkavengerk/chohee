<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '@chohee/ui/components/Button.svelte';
  import Input from '@chohee/ui/components/Input.svelte';
  import Textarea from '@chohee/ui/components/Textarea.svelte';
  import Card from '@chohee/ui/components/Card.svelte';

  import type { PageData } from './$types';

  type FormState = {
    error?: string;
    issues?: Record<string, string[]>;
    values?: { displayName?: string; handle?: string; bio?: string | null };
  };

  let { data, form }: { data: PageData; form: FormState | null } = $props();
  const me = $derived(data.me);
  const issues = $derived<Record<string, string[]>>(form?.issues ?? {});
  const fallback = $derived(form?.values ?? null);

  let submitting = $state(false);
</script>

<svelte:head>
  <title>프로필 편집 — Chohee</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-6 py-12">
  <a href="/me" class="text-fg-3 hover:text-fg-1 text-sm">← 마이페이지</a>
  <h1 class="mt-4 text-2xl font-semibold">프로필 편집</h1>

  {#if form?.error && !issues}
    <p class="bg-danger/10 text-danger border-danger/30 mt-4 rounded-md border px-4 py-3 text-sm">
      {form.error}
    </p>
  {/if}

  <Card class="mt-8" padding="lg">
    <form
      method="POST"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update();
          submitting = false;
        };
      }}
      class="space-y-5"
    >
      <label class="block">
        <span class="text-fg-2 mb-1 block text-xs">표시 이름</span>
        <Input
          name="displayName"
          value={fallback?.displayName ?? me.displayName ?? ''}
          placeholder="개발 테스터"
          invalid={!!issues.displayName}
        />
        {#if issues.displayName}
          <p class="text-danger mt-1 text-xs">{issues.displayName.join(', ')}</p>
        {/if}
      </label>

      <label class="block">
        <span class="text-fg-2 mb-1 block text-xs">핸들 (URL에 사용)</span>
        <Input
          name="handle"
          value={fallback?.handle ?? me.handle}
          placeholder="dev_tester"
          invalid={!!issues.handle}
        />
        <p class="text-fg-4 mt-1 text-xs">소문자 영문, 숫자, 밑줄만. 2–24자.</p>
        {#if issues.handle}
          <p class="text-danger mt-1 text-xs">{issues.handle.join(', ')}</p>
        {/if}
      </label>

      <label class="block">
        <span class="text-fg-2 mb-1 block text-xs">소개</span>
        <Textarea
          name="bio"
          value={fallback?.bio ?? me.bio ?? ''}
          rows={4}
          placeholder="당신을 한 문장으로"
          invalid={!!issues.bio}
        />
        {#if issues.bio}
          <p class="text-danger mt-1 text-xs">{issues.bio.join(', ')}</p>
        {/if}
      </label>

      <div class="flex items-center gap-3 pt-2">
        <Button type="submit" loading={submitting}>저장</Button>
        <Button variant="ghost" href="/me">취소</Button>
      </div>
    </form>
  </Card>
</div>
