<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '@chohee/ui/components/Button.svelte';
  import Input from '@chohee/ui/components/Input.svelte';
  import Textarea from '@chohee/ui/components/Textarea.svelte';
  import Card from '@chohee/ui/components/Card.svelte';
  import Chip from '@chohee/ui/components/Chip.svelte';

  import { untrack } from 'svelte';
  import type { PageData } from './$types';

  type AlbumValues = {
    title?: string;
    conceptDescription?: string | null;
    moodTags?: string[];
    status?: 'draft' | 'published' | 'private';
  };
  type FormState = {
    error?: string;
    issues?: Record<string, string[]>;
    values?: AlbumValues;
  };

  let { data, form }: { data: PageData; form: FormState | null } = $props();
  const issues = $derived<Record<string, string[]>>(form?.issues ?? {});
  const fallback = $derived(form?.values ?? null);

  let submitting = $state(false);
  let selectedMoods = $state<string[]>(untrack(() => form?.values?.moodTags ?? []));

  function toggleMood(tag: string): void {
    if (selectedMoods.includes(tag)) selectedMoods = selectedMoods.filter((t) => t !== tag);
    else if (selectedMoods.length < 8) selectedMoods = [...selectedMoods, tag];
  }
</script>

<svelte:head>
  <title>앨범 만들기 — Chohee</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-12">
  <a href="/upload" class="text-fg-3 hover:text-fg-1 text-sm">← 업로드</a>
  <h1 class="mt-4 text-3xl font-semibold">앨범 만들기</h1>
  <p class="text-fg-3 mt-2 text-sm">
    컨셉으로 묶어 곡과 가사를 하나의 흐름으로. 곡/가사 묶기는 발행 후 앨범 상세 페이지에서.
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
          placeholder="앨범 제목"
          invalid={!!issues.title}
        />
        {#if issues.title}
          <p class="text-danger mt-1 text-xs">{issues.title.join(', ')}</p>
        {/if}
      </label>

      <label class="mt-5 block">
        <span class="text-fg-2 mb-1 block text-xs">컨셉 설명 (선택)</span>
        <Textarea
          name="conceptDescription"
          value={fallback?.conceptDescription ?? ''}
          rows={5}
          placeholder="앨범 전체의 분위기, 이야기, 흐름을 짧게."
        />
      </label>

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

      <div class="mt-5">
        <span class="text-fg-2 mb-2 block text-xs">상태</span>
        <select
          name="status"
          value={fallback?.status ?? 'draft'}
          class="bg-bg-2 border-bd-1 text-fg-1 focus:border-accent rounded-md border px-3 py-2 text-sm focus:outline-none"
        >
          <option value="draft">초안</option>
          <option value="published">공개</option>
          <option value="private">비공개</option>
        </select>
      </div>
    </Card>

    <div class="flex gap-3 pt-2">
      <Button type="submit" loading={submitting}>만들기</Button>
      <Button variant="ghost" href="/upload">취소</Button>
    </div>
  </form>
</div>
