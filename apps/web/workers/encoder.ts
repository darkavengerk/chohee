/// <reference lib="webworker" />

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// ffmpeg.wasm은 SharedArrayBuffer가 필요 → 페이지에서 COOP/COEP 헤더 설정 필수.
// 인코딩은 페이지 본 스레드를 막지 않도록 이 워커에서 실행한다.

export interface EncodeRequest {
  type: 'encode';
  fileBuffer: ArrayBuffer;
  filename: string;
  bitratesKbps: ReadonlyArray<128 | 192 | 320>;
}

export interface EncodeProgress {
  type: 'progress';
  stage: 'init' | 'transcode' | 'measuring';
  bitrateKbps?: number;
  ratio?: number;
}

export interface EncodeResult {
  type: 'done';
  renditions: { bitrateKbps: 128 | 192 | 320; buffer: ArrayBuffer; mimeType: string }[];
  durationSeconds: number;
  loudnessLufs: number | null;
}

export interface EncodeError {
  type: 'error';
  message: string;
}

declare const self: DedicatedWorkerGlobalScope;

let ffmpeg: FFmpeg | null = null;

async function ensureFfmpeg(): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;
  ffmpeg = new FFmpeg();
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  return ffmpeg;
}

async function probeDurationSeconds(ff: FFmpeg, inputName: string): Promise<number> {
  let durationSec = 0;
  const logHandler = (e: { type: string; message: string }) => {
    const m = e.message.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (m) {
      const [, hh, mm, ss] = m;
      durationSec = Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
    }
  };
  ff.on('log', logHandler);
  await ff.exec(['-i', inputName, '-f', 'null', '-']);
  ff.off('log', logHandler);
  return durationSec;
}

self.onmessage = async (e: MessageEvent<EncodeRequest>) => {
  if (e.data.type !== 'encode') return;
  try {
    const ff = await ensureFfmpeg();
    self.postMessage({ type: 'progress', stage: 'init' } satisfies EncodeProgress);

    const inputName = sanitize(e.data.filename);
    await ff.writeFile(inputName, new Uint8Array(e.data.fileBuffer));
    const durationSec = await probeDurationSeconds(ff, inputName);

    const renditions: EncodeResult['renditions'] = [];
    for (const br of e.data.bitratesKbps) {
      const outName = `out_${br}.m4a`;
      ff.on('progress', (p) => {
        self.postMessage({
          type: 'progress',
          stage: 'transcode',
          bitrateKbps: br,
          ratio: p.progress,
        } satisfies EncodeProgress);
      });
      await ff.exec([
        '-y',
        '-i',
        inputName,
        '-vn',
        '-c:a',
        'aac',
        '-b:a',
        `${br}k`,
        '-movflags',
        '+faststart',
        outName,
      ]);
      const data = (await ff.readFile(outName)) as Uint8Array;
      // structured clone을 위해 ArrayBuffer 복사
      const buf = data.slice().buffer;
      renditions.push({ bitrateKbps: br, buffer: buf, mimeType: 'audio/mp4' });
      await ff.deleteFile(outName);
    }

    self.postMessage({ type: 'progress', stage: 'measuring' } satisfies EncodeProgress);
    const loudness = await measureLoudness(ff, inputName);

    await ff.deleteFile(inputName);

    self.postMessage(
      {
        type: 'done',
        renditions,
        durationSeconds: durationSec,
        loudnessLufs: loudness,
      } satisfies EncodeResult,
      renditions.map((r) => r.buffer),
    );
  } catch (err) {
    self.postMessage({
      type: 'error',
      message: err instanceof Error ? err.message : String(err),
    } satisfies EncodeError);
  }
};

async function measureLoudness(ff: FFmpeg, inputName: string): Promise<number | null> {
  let lufs: number | null = null;
  const handler = (e: { type: string; message: string }) => {
    const m = e.message.match(/I:\s*(-?\d+\.\d+)\s*LUFS/);
    if (m) lufs = Number(m[1]);
  };
  ff.on('log', handler);
  try {
    await ff.exec(['-i', inputName, '-af', 'ebur128=peak=true', '-f', 'null', '-']);
  } catch {
    // ebur128 미지원이거나 실패해도 무시
  }
  ff.off('log', handler);
  return lufs;
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
}

// 워커가 모듈로 인식되도록 export
export {};
