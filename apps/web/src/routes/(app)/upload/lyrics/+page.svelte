<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '@chohee/ui/components/Button.svelte';
  import Input from '@chohee/ui/components/Input.svelte';
  import Textarea from '@chohee/ui/components/Textarea.svelte';
  import Card from '@chohee/ui/components/Card.svelte';
  import Chip from '@chohee/ui/components/Chip.svelte';

  import { untrack } from 'svelte';
  import type { PageData } from './$types';

  type LyricsValues = {
    title?: string;
    text?: string;
    language?: 'ko' | 'en' | 'ja' | 'zh' | 'other';
    moodTags?: string[];
    isPublic?: boolean;
  };
  type FormState = {
    error?: string;
    issues?: Record<string, string[]>;
    values?: LyricsValues;
    requestMusic?: boolean;
  };

  let { data, form }: { data: PageData; form: FormState | null } = $props();
  const issues = $derived<Record<string, string[]>>(form?.issues ?? {});
  const fallback = $derived(form?.values ?? null);

  let submitting = $state(false);
  let selectedMoods = $state<string[]>(untrack(() => form?.values?.moodTags ?? []));
  let requestMusic = $state<boolean>(untrack(() => form?.requestMusic ?? false));

  function toggleMood(tag: string): void {
    if (selectedMoods.includes(tag)) selectedMoods = selectedMoods.filter((t) => t !== tag);
    else if (selectedMoods.length < 8) selectedMoods = [...selectedMoods, tag];
  }
</script>

<svelte:head>
  <title>가사 쓰기 — Chohee</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-12">
  <a href="/upload" class="text-fg-3 hover:text-fg-1 text-sm">← 업로드</a>
  <h1 class="mt-4 text-3xl font-semibold">가사 쓰기</h1>
  <p class="text-fg-3 mt-2 text-sm">
    가사는 1급 콘텐츠입니다. 음악 없이도 발행 가능하고, 원하면 다른 사용자에게 음악 제안을 받을 수
    있어요.
  </p>

  {#if form?.error}
    <p class="bg-danger/10 text-danger border-danger/30 mt-6 rounded-md border px-4 py-3 text-sm">
      {form.error}
    </p>
  {/if}

  <form
    method="POST"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        await update();
        submitting = false;
      };
    }}
    class="mt-8 space-y-6"
  >
    <Card padding="lg">
      <label class="block">
        <span class="text-fg-2 mb-1 block text-xs">제목</span>
        <Input
          name="title"
          value={fallback?.title ?? ''}
          placeholder="가사 제목"
          invalid={!!issues.title}
        />
        {#if issues.title}
          <p class="text-danger mt-1 text-xs">{issues.title.join(', ')}</p>
        {/if}
      </label>

      <label class="mt-5 block">
        <span class="text-fg-2 mb-1 block text-xs">본문</span>
        <Textarea
          name="text"
          value={fallback?.text ?? ''}
          rows={14}
          placeholder={'한 줄씩 자유롭게.\n\n빈 줄 두 개로 연을 구분할 수 있어요.'}
          serif
          invalid={!!issues.text}
        />
        {#if issues.text}
          <p class="text-danger mt-1 text-xs">{issues.text.join(', ')}</p>
        {/if}
      </label>

      <div class="mt-5">
        <span class="text-fg-2 mb-2 block text-xs">언어</span>
        <select
          name="language"
          value={fallback?.language ?? 'ko'}
          class="bg-bg-2 border-bd-1 text-fg-1 focus:border-accent rounded-md border px-3 py-2 text-sm focus:outline-none"
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
          <option value="other">기타</option>
        </select>
      </div>

      <div class="mt-5">
        <span class="text-fg-2 mb-2 block text-xs">무드 태그 (선택, 최대 8개)</span>
        <div class="flex flex-wrap gap-2">
          {#each data.moodPreset as tag (tag)}
            <Chip selected={selectedMoods.includes(tag)} onclick={() => toggleMood(tag)}>
              {tag}
            </Chip>
          {/each}
        </div>
        {#each selectedMoods as tag (tag)}
          <input type="hidden" name="moodTags" value={tag} />
        {/each}
      </div>

      <label class="text-fg-2 mt-5 flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublic" checked class="accent-accent" />
        공개
      </label>
    </Card>

    <Card padding="lg">
      <label class="text-fg-1 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="requestMusic"
          bind:checked={requestMusic}
          class="accent-accent mt-1"
        />
        <span>
          <span class="font-medium">다른 사용자에게 음악 제안을 받기</span>
          <span class="text-fg-3 mt-1 block text-xs">
            요청을 발행하면 이 가사가 "음악을 기다리는 가사" 피드에 노출됩니다. 후보 제안과 채택은
            Phase 2에서 동작합니다.
          </span>
        </span>
      </label>

      {#if requestMusic}
        <div class="border-bd-1 mt-4 space-y-3 border-l-2 pl-4">
          <label class="block">
            <span class="text-fg-2 mb-1 block text-xs">장르 힌트 (쉼표로 구분)</span>
            <Input name="genreHints" placeholder="lo-fi, indie folk" />
          </label>
          <label class="block">
            <span class="text-fg-2 mb-1 block text-xs">메모</span>
            <Textarea name="notes" rows={3} placeholder="제안자에게 전달할 짧은 컨텍스트" />
          </label>
        </div>
      {/if}
    </Card>

    <div class="flex gap-3 pt-2">
      <Button type="submit" loading={submitting}>발행</Button>
      <Button variant="ghost" href="/upload">취소</Button>
    </div>
  </form>
</div>
