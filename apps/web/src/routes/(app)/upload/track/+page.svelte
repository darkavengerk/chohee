<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '@chohee/ui/components/Button.svelte';
  import Input from '@chohee/ui/components/Input.svelte';
  import Textarea from '@chohee/ui/components/Textarea.svelte';
  import Card from '@chohee/ui/components/Card.svelte';
  import Chip from '@chohee/ui/components/Chip.svelte';
  import DropZone from '@chohee/ui/components/DropZone.svelte';
  import ProgressBar from '@chohee/ui/components/ProgressBar.svelte';
  import Waveform from '@chohee/ui/components/Waveform.svelte';
  import { apiClientFetch } from '$lib/api-client';
  import { computeWaveform } from '$lib/waveform';
  import { requestPresignedUrl, uploadBlobToPresignedUrl } from '$lib/upload';
  import type {
    EncoderOut,
    EncodeRendition,
  } from '$lib/workers/encoder';

  let { data } = $props();

  // 폼 필드
  let title = $state('');
  let description = $state('');
  let selectedMoods = $state<string[]>([]);
  let language = $state<'ko' | 'en' | 'ja' | 'zh' | 'other'>('ko');

  // 파일 + 처리 상태
  let file = $state<File | null>(null);
  let stage = $state<'idle' | 'encoding' | 'waveform' | 'uploading' | 'saving' | 'done' | 'error'>(
    'idle',
  );
  let stageMsg = $state('');
  let progress = $state(0); // 0..1
  let perBitrate = $state<Record<number, number>>({});
  let renditions = $state<EncodeRendition[] | null>(null);
  let durationSeconds = $state(0);
  let loudness = $state<number | null>(null);
  let peaks = $state<number[]>([]);
  let uploadedKeys = $state<{ bitrateKbps: number; key: string; contentLength: number }[]>([]);
  let audioKeyPrefix = $state<string>('');
  let waveformKey = $state<string | null>(null);
  let errorMsg = $state<string | null>(null);

  const acceptList = $derived(data.acceptedAudio.join(','));
  const maxMb = $derived(Math.floor(data.audioMaxBytes / (1024 * 1024)));

  function toggleMood(tag: string): void {
    if (selectedMoods.includes(tag)) selectedMoods = selectedMoods.filter((t) => t !== tag);
    else if (selectedMoods.length < 8) selectedMoods = [...selectedMoods, tag];
  }

  function reset(): void {
    file = null;
    stage = 'idle';
    progress = 0;
    perBitrate = {};
    renditions = null;
    peaks = [];
    uploadedKeys = [];
    audioKeyPrefix = '';
    waveformKey = null;
    errorMsg = null;
    stageMsg = '';
  }

  async function handleFile(files: File[]): Promise<void> {
    const f = files[0];
    if (!f) return;
    if (f.size > data.audioMaxBytes) {
      errorMsg = `파일이 너무 큽니다. 최대 ${maxMb}MB.`;
      return;
    }
    if (!(data.acceptedAudio as readonly string[]).includes(f.type)) {
      errorMsg = `지원하지 않는 형식: ${f.type || '알 수 없음'}`;
      return;
    }
    errorMsg = null;
    file = f;
    if (!title) title = f.name.replace(/\.[^.]+$/, '').slice(0, 60);
    await processFile(f);
  }

  async function processFile(f: File): Promise<void> {
    try {
      // 1. 인코딩 (Web Worker)
      stage = 'encoding';
      stageMsg = '인코더 로드 중…';
      progress = 0;

      const EncoderWorker = (await import('$lib/workers/encoder?worker')).default;
      const worker = new EncoderWorker();
      const buffer = await f.arrayBuffer();

      const encoded = await new Promise<{
        renditions: EncodeRendition[];
        durationSeconds: number;
        loudnessLufs: number | null;
      }>((resolve, reject) => {
        worker.onmessage = (e: MessageEvent<EncoderOut>) => {
          const msg = e.data;
          if (msg.type === 'progress') {
            if (msg.stage === 'init') stageMsg = 'ffmpeg.wasm 초기화…';
            else if (msg.stage === 'transcode' && msg.bitrateKbps) {
              perBitrate = { ...perBitrate, [msg.bitrateKbps]: msg.ratio ?? 0 };
              const vals = Object.values(perBitrate);
              progress = vals.length ? vals.reduce((a, b) => a + b, 0) / data.bitrates.length : 0;
              stageMsg = `인코딩 중 (${msg.bitrateKbps}kbps)`;
            } else if (msg.stage === 'measuring') {
              stageMsg = 'LUFS 측정 중…';
            }
          } else if (msg.type === 'done') {
            resolve({
              renditions: msg.renditions,
              durationSeconds: msg.durationSeconds,
              loudnessLufs: msg.loudnessLufs,
            });
          } else if (msg.type === 'error') {
            reject(new Error(msg.message));
          }
        };
        worker.postMessage(
          {
            type: 'encode',
            fileBuffer: buffer,
            filename: f.name,
            bitratesKbps: data.bitrates,
          },
          [buffer],
        );
      }).finally(() => worker.terminate());

      renditions = encoded.renditions;
      durationSeconds = encoded.durationSeconds;
      loudness = encoded.loudnessLufs;
      progress = 1;

      // 2. 파형 (원본 디코딩)
      stage = 'waveform';
      stageMsg = '파형 계산 중…';
      const wf = await computeWaveform(f, 1024);
      peaks = wf.peaks;
      if (!durationSeconds && wf.duration) durationSeconds = wf.duration;

      // 3. 업로드 (각 비트레이트 + 파형 JSON)
      stage = 'uploading';
      stageMsg = 'R2에 업로드 중…';
      progress = 0;
      audioKeyPrefix = crypto.randomUUID();
      uploadedKeys = [];
      const totalSize = renditions.reduce((s, r) => s + r.buffer.byteLength, 0);
      let uploaded = 0;

      for (const r of renditions) {
        const blob = new Blob([r.buffer], { type: r.mimeType });
        const presign = await requestPresignedUrl({
          kind: 'audio',
          contentType: r.mimeType,
          contentLength: blob.size,
          scope: 'track',
          resourceId: audioKeyPrefix,
          filenameHint: `audio_${r.bitrateKbps}k.m4a`,
        });
        if (!presign.ok) throw new Error(`서명된 URL 발급 실패: ${presign.error.message}`);
        const startSize = uploaded;
        await uploadBlobToPresignedUrl(presign.data, blob, (loaded) => {
          progress = (startSize + loaded) / totalSize;
        });
        uploaded += blob.size;
        uploadedKeys = [
          ...uploadedKeys,
          { bitrateKbps: r.bitrateKbps, key: presign.data.key, contentLength: blob.size },
        ];
      }

      // 파형 JSON 업로드
      const waveformBlob = new Blob([JSON.stringify({ peaks, duration: durationSeconds })], {
        type: 'application/json',
      });
      const wfPresign = await requestPresignedUrl({
        kind: 'image',
        contentType: 'image/webp', // dummy — 파형은 별도 scope. 일단 image MIME으로 우회 X.
        contentLength: waveformBlob.size,
        scope: 'waveform',
        resourceId: audioKeyPrefix,
        filenameHint: 'waveform.json',
      });
      // 파형은 image MIME 검증이 안 맞아 실패할 수 있음 — Phase 1에선 메타만 D1에 저장 (waveformKey 생략)
      if (wfPresign.ok) {
        try {
          await uploadBlobToPresignedUrl(wfPresign.data, waveformBlob);
          waveformKey = wfPresign.data.key;
        } catch {
          waveformKey = null;
        }
      }

      progress = 1;
      stage = 'idle'; // 폼 입력 단계로 복귀
      stageMsg = '업로드 완료. 메타데이터 입력 후 발행.';
    } catch (e) {
      stage = 'error';
      errorMsg = e instanceof Error ? e.message : String(e);
    }
  }

  async function submit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (!renditions || !uploadedKeys.length || !title.trim()) {
      errorMsg = '제목과 파일을 모두 준비해주세요.';
      return;
    }
    stage = 'saving';
    stageMsg = '트랙 메타데이터 저장 중…';
    errorMsg = null;

    const body = {
      title: title.trim(),
      description: description.trim() || null,
      audioKeyPrefix,
      renditions: uploadedKeys,
      waveformKey: waveformKey ?? undefined,
      durationMs: Math.round(durationSeconds * 1000),
      loudnessLufs: loudness ?? undefined,
      moodTags: selectedMoods,
      language,
      status: 'published' as const,
      generatedBy: 'human' as const,
    };
    const res = await apiClientFetch<{ id: string }>('/tracks', { method: 'POST', body });
    if (!res.ok) {
      stage = 'error';
      errorMsg = res.error.message;
      return;
    }
    stage = 'done';
    await goto('/me');
  }
</script>

<svelte:head>
  <title>곡 올리기 — Chohee</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-12">
  <a href="/upload" class="text-fg-3 hover:text-fg-1 text-sm">← 업로드</a>
  <h1 class="mt-4 text-3xl font-semibold">곡 올리기</h1>
  <p class="text-fg-3 mt-2 text-sm">
    오디오를 브라우저에서 멀티 비트레이트로 변환해 R2에 직접 업로드합니다 (최대 {maxMb}MB).
  </p>

  {#if errorMsg}
    <p class="bg-danger/10 text-danger border-danger/30 mt-6 rounded-md border px-4 py-3 text-sm">
      {errorMsg}
    </p>
  {/if}

  <Card padding="lg" class="mt-8">
    {#if !file}
      <DropZone accept={acceptList} onfiles={handleFile} />
    {:else}
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-fg-1 truncate text-sm font-medium">{file.name}</p>
          <p class="text-fg-4 mt-0.5 text-xs">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
            {#if durationSeconds}· {formatDuration(durationSeconds)}{/if}
            {#if loudness !== null}· {loudness.toFixed(1)} LUFS{/if}
          </p>
        </div>
        {#if stage === 'idle' || stage === 'error' || stage === 'done'}
          <button
            type="button"
            onclick={reset}
            class="text-fg-3 hover:text-fg-1 text-xs underline-offset-2 hover:underline"
          >
            다른 파일
          </button>
        {/if}
      </div>

      {#if stage === 'encoding' || stage === 'waveform' || stage === 'uploading' || stage === 'saving'}
        <div class="mt-5">
          <ProgressBar value={progress} label={stageMsg} indeterminate={stage === 'waveform' || stage === 'saving'} />
        </div>
      {:else if peaks.length}
        <div class="mt-5">
          <Waveform {peaks} height={48} />
        </div>
      {/if}
    {/if}
  </Card>

  {#if file && stage !== 'encoding' && stage !== 'waveform' && stage !== 'uploading'}
    <form onsubmit={submit} class="mt-8 space-y-6">
      <Card padding="lg">
        <label class="block">
          <span class="text-fg-2 mb-1 block text-xs">제목</span>
          <Input bind:value={title} placeholder="곡 제목" />
        </label>

        <label class="mt-5 block">
          <span class="text-fg-2 mb-1 block text-xs">설명 (선택)</span>
          <Textarea bind:value={description} rows={4} placeholder="곡에 대한 짧은 설명, 비하인드 등" />
        </label>

        <div class="mt-5">
          <span class="text-fg-2 mb-2 block text-xs">언어</span>
          <select
            bind:value={language}
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
        </div>
      </Card>

      <div class="flex gap-3 pt-2">
        <Button type="submit" loading={stage === 'saving'} disabled={!renditions}>
          {renditions ? '발행' : '업로드 완료 후 발행'}
        </Button>
        <Button variant="ghost" href="/upload">취소</Button>
      </div>
    </form>
  {/if}
</div>

<script lang="ts" module>
  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>
