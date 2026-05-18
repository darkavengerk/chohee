'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Chip,
  DropZone,
  Input,
  ProgressBar,
  Textarea,
  useToast,
} from '@chohee/ui';
import {
  ACCEPTED_AUDIO_MIME,
  BITRATES_KBPS,
  MOOD_TAGS_PRESET,
  UPLOAD_LIMITS,
  type BitrateKbps,
} from '@chohee/shared';
import { computeWaveform } from '@/lib/waveform';
import { requestPresignedUrl, uploadBlobToPresignedUrl } from '@/lib/upload';
import { apiFetch } from '@/lib/api-client';

type Step = 'pick' | 'encode' | 'meta' | 'uploading' | 'done';

interface EncodedRendition {
  bitrateKbps: BitrateKbps;
  blob: Blob;
}

export function TrackUploadFlow() {
  const router = useRouter();
  const { show } = useToast();
  const [step, setStep] = useState<Step>('pick');
  const [file, setFile] = useState<File | null>(null);
  const [renditions, setRenditions] = useState<EncodedRendition[]>([]);
  const [durationSec, setDurationSec] = useState(0);
  const [loudnessLufs, setLoudnessLufs] = useState<number | null>(null);
  const [encodeStage, setEncodeStage] = useState('준비');
  const [encodeRatio, setEncodeRatio] = useState(0);
  const [uploadPct, setUploadPct] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [waveformPeaks, setWaveformPeaks] = useState<number[]>([]);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  async function startEncode(picked: File) {
    if (picked.size > UPLOAD_LIMITS.AUDIO_MAX_BYTES) {
      show({
        tone: 'danger',
        title: '파일이 너무 큽니다',
        description: `최대 ${Math.round(UPLOAD_LIMITS.AUDIO_MAX_BYTES / 1024 / 1024)}MB까지 업로드할 수 있습니다.`,
      });
      return;
    }
    if (!(ACCEPTED_AUDIO_MIME as readonly string[]).includes(picked.type)) {
      show({
        tone: 'warn',
        title: '지원하지 않는 형식일 수 있습니다',
        description: `브라우저가 보고한 형식: ${picked.type || '알 수 없음'}. 그래도 계속 시도합니다.`,
      });
    }
    setFile(picked);
    setTitle(picked.name.replace(/\.[^.]+$/, ''));
    setStep('encode');

    // 파형은 메인 스레드에서 계산 (Web Audio API 사용)
    void computeWaveform(picked, 1024)
      .then((w) => {
        setWaveformPeaks(w.peaks);
        setDurationSec((d) => (d > 0 ? d : w.duration));
      })
      .catch(() => {
        // 디코드 실패해도 인코딩은 계속 시도
      });

    const w = new Worker(new URL('@/workers/encoder.ts', import.meta.url), { type: 'module' });
    workerRef.current = w;
    w.onmessage = async (
      e: MessageEvent<
        | { type: 'progress'; stage: 'init' | 'transcode' | 'measuring'; bitrateKbps?: number; ratio?: number }
        | { type: 'done'; renditions: { bitrateKbps: BitrateKbps; buffer: ArrayBuffer; mimeType: string }[]; durationSeconds: number; loudnessLufs: number | null }
        | { type: 'error'; message: string }
      >,
    ) => {
      const data = e.data;
      if (data.type === 'progress') {
        setEncodeStage(
          data.stage === 'init'
            ? 'ffmpeg 로딩'
            : data.stage === 'measuring'
              ? '음량 측정'
              : `${data.bitrateKbps}kbps 인코딩`,
        );
        setEncodeRatio(data.ratio ?? 0);
      } else if (data.type === 'done') {
        setRenditions(
          data.renditions.map((r) => ({
            bitrateKbps: r.bitrateKbps,
            blob: new Blob([r.buffer], { type: r.mimeType }),
          })),
        );
        setDurationSec(data.durationSeconds || 0);
        setLoudnessLufs(data.loudnessLufs);
        setStep('meta');
      } else if (data.type === 'error') {
        show({ tone: 'danger', title: '인코딩 실패', description: data.message });
        setStep('pick');
      }
    };
    const buf = await picked.arrayBuffer();
    w.postMessage(
      {
        type: 'encode',
        fileBuffer: buf,
        filename: picked.name,
        bitratesKbps: BITRATES_KBPS,
      },
      [buf],
    );
  }

  async function uploadAndSave() {
    if (!file || renditions.length === 0) return;
    setStep('uploading');
    setUploadPct(0);

    const resourceId = crypto.randomUUID();
    const uploadedKeys: { bitrateKbps: BitrateKbps; key: string; contentLength: number }[] = [];

    let cumulativeBytes = 0;
    const totalBytes = renditions.reduce((sum, r) => sum + r.blob.size, 0);

    try {
      for (const r of renditions) {
        const presign = await requestPresignedUrl({
          kind: 'audio',
          contentType: r.blob.type || 'audio/mp4',
          contentLength: r.blob.size,
          scope: 'track',
          resourceId,
          filenameHint: `${r.bitrateKbps}kbps.m4a`,
        });
        if (!presign.ok) throw new Error(presign.error.message);
        await uploadBlobToPresignedUrl(presign.data, r.blob, (loaded) => {
          const pct = ((cumulativeBytes + loaded) / totalBytes) * 100;
          setUploadPct(pct);
        });
        cumulativeBytes += r.blob.size;
        uploadedKeys.push({
          bitrateKbps: r.bitrateKbps,
          key: presign.data.key,
          contentLength: r.blob.size,
        });
      }

      // 파형 JSON 업로드
      let waveformKey: string | null = null;
      if (waveformPeaks.length) {
        const wfBlob = new Blob([JSON.stringify({ peaks: waveformPeaks, version: 1 })], {
          type: 'application/json',
        });
        const wfPresign = await requestPresignedUrl({
          kind: 'image', // image/json 미지원이라 일단 음원과 같은 처리 안 함 — 별도 scope
          // 우회: image MIME 검증을 피하기 위해 application/json은 audio scope으로 못 올라가므로
          // R2에 직접 PUT은 가능하나 검증을 통과시키려면 별도 처리 필요.
          // Phase 1에선 단순화: 파형 업로드는 skip하고 후에 별도 처리.
          contentType: 'application/json',
          contentLength: wfBlob.size,
          scope: 'waveform',
          resourceId,
          filenameHint: 'waveform.json',
        });
        if (wfPresign.ok) {
          await uploadBlobToPresignedUrl(wfPresign.data, wfBlob);
          waveformKey = wfPresign.data.key;
        }
      }

      const create = await apiFetch<{ id: string }>('/tracks', {
        method: 'POST',
        body: {
          title,
          description: description || null,
          audioKeyPrefix: `tracks/${resourceId}`,
          renditions: uploadedKeys,
          waveformKey,
          durationMs: Math.round(durationSec * 1000),
          loudnessLufs,
          status: 'published',
          generatedBy: 'ai_assisted',
          moodTags,
          language: 'ko',
        },
      });
      if (!create.ok) throw new Error(create.error.message);
      setStep('done');
      show({ tone: 'success', title: '업로드 완료', description: '곡이 공개되었습니다' });
      router.push('/me');
    } catch (err) {
      show({
        tone: 'danger',
        title: '업로드 실패',
        description: err instanceof Error ? err.message : '알 수 없는 오류',
      });
      setStep('meta');
    }
  }

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)}MB · ${file.type || '?'}`;
  }, [file]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="flex flex-col gap-6 rounded-lg border border-bd-1 bg-bg-1 p-6">
        {step === 'pick' && (
          <DropZone
            accept={ACCEPTED_AUDIO_MIME.join(',')}
            onFiles={(files) => files[0] && startEncode(files[0])}
            title="음원 파일을 끌어다 놓으세요"
            hint="MP3, M4A, WAV, FLAC 등 · 최대 200MB"
          />
        )}
        {step !== 'pick' && (
          <div className="flex flex-col gap-3 rounded-lg border border-bd-1 bg-bg-2 p-4">
            <p className="font-mono text-[11.5px] text-fg-3">{fileMeta}</p>
            {step === 'encode' && (
              <>
                <p className="text-[13px] text-fg-1">{encodeStage}</p>
                <ProgressBar value={encodeRatio * 100} showPercentage label="브라우저에서 인코딩 중" />
                <p className="text-[11.5px] text-fg-4">
                  ffmpeg.wasm이 처음 로딩될 땐 시간이 걸릴 수 있습니다. 탭을 닫지 마세요.
                </p>
              </>
            )}
            {step === 'meta' && (
              <p className="text-[12px] text-success">
                ✓ {renditions.length}개 비트레이트 인코딩 완료 · {Math.round(durationSec)}초
                {loudnessLufs !== null ? ` · ${loudnessLufs.toFixed(1)} LUFS` : ''}
              </p>
            )}
            {step === 'uploading' && (
              <ProgressBar value={uploadPct} showPercentage label="R2 업로드" tone="success" />
            )}
            {step === 'done' && <p className="text-[13px] text-success">✓ 업로드 완료</p>}
          </div>
        )}

        {(step === 'meta' || step === 'uploading') && (
          <div className="flex flex-col gap-5">
            <Input
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
            <Textarea
              label="설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              hint="이 곡에 담긴 이야기, 가사 의도, 함께 들으면 좋은 시간 등"
              maxLength={2000}
            />
            <div className="flex flex-col gap-2">
              <span className="text-[12px] text-fg-2">무드 태그</span>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS_PRESET.map((tag) => (
                  <Chip
                    key={tag}
                    active={moodTags.includes(tag)}
                    onClick={() =>
                      setMoodTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 8),
                      )
                    }
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => router.push('/me')}>
                나중에 하기
              </Button>
              <Button onClick={uploadAndSave} loading={step === 'uploading'}>
                업로드 후 공개
              </Button>
            </div>
          </div>
        )}
      </section>

      <aside className="flex flex-col gap-4 rounded-lg border border-bd-1 bg-bg-1 p-6">
        <p className="text-[11px] uppercase tracking-wider text-fg-4">처리 단계</p>
        <ol className="flex flex-col gap-3 text-[13px] text-fg-2">
          <Step n={1} active={step === 'pick'} done={step !== 'pick'}>
            파일 선택
          </Step>
          <Step n={2} active={step === 'encode'} done={step === 'meta' || step === 'uploading' || step === 'done'}>
            브라우저 인코딩 (128 · 192 · 320 kbps)
          </Step>
          <Step n={3} active={step === 'meta'} done={step === 'uploading' || step === 'done'}>
            메타데이터 작성
          </Step>
          <Step n={4} active={step === 'uploading'} done={step === 'done'}>
            R2 직접 업로드
          </Step>
          <Step n={5} active={step === 'done'} done={step === 'done'}>
            공개
          </Step>
        </ol>
        <p className="mt-4 rounded-md border border-bd-1 bg-bg-2 p-3 text-[11.5px] leading-[1.7] text-fg-3">
          음원은 절대 우리 서버를 거치지 않습니다. 브라우저에서 직접 Cloudflare R2로 PUT 합니다.
          서버는 메타데이터만 보관합니다.
        </p>
      </aside>
    </div>
  );
}

function Step({
  n,
  active,
  done,
  children,
}: {
  n: number;
  active: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={
          'flex h-6 w-6 items-center justify-center rounded-pill border text-[11px] font-medium ' +
          (done
            ? 'border-success/40 bg-success/10 text-success'
            : active
              ? 'border-accent/40 bg-accent-soft text-accent'
              : 'border-bd-1 bg-bg-2 text-fg-3')
        }
      >
        {done ? '✓' : n}
      </span>
      <span className={done || active ? 'text-fg-1' : 'text-fg-3'}>{children}</span>
    </li>
  );
}
