/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// ffmpeg.wasm은 SharedArrayBuffer가 필요. COOP/COEP는 hooks.server.ts에서 설정.

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

export interface EncodeRendition {
  bitrateKbps: 128 | 192 | 320;
  buffer: ArrayBuffer;
  mimeType: string;
}

export interface EncodeResult {
  type: 'done';
  renditions: EncodeRendition[];
  durationSeconds: number;
  loudnessLufs: number | null;
}

export interface EncodeError {
  type: 'error';
  message: string;
}

export type EncoderOut = EncodeProgress | EncodeResult | EncodeError;

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
  const handler = (e: { type: string; message: string }) => {
    const m = e.message.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (m) durationSec = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
  };
  ff.on('log', handler);
  await ff.exec(['-i', inputName, '-f', 'null', '-']);
  ff.off('log', handler);
  return durationSec;
}

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
    // ebur128 미지원 시 무시
  }
  ff.off('log', handler);
  return lufs;
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
}

self.onmessage = async (e: MessageEvent<EncodeRequest>) => {
  if (e.data.type !== 'encode') return;
  try {
    const ff = await ensureFfmpeg();
    self.postMessage({ type: 'progress', stage: 'init' } satisfies EncodeProgress);

    const inputName = sanitize(e.data.filename);
    await ff.writeFile(inputName, new Uint8Array(e.data.fileBuffer));
    const durationSec = await probeDurationSeconds(ff, inputName);

    const renditions: EncodeRendition[] = [];
    for (const br of e.data.bitratesKbps) {
      const outName = `out_${br}.m4a`;
      const onProgress = (p: { progress: number }) => {
        self.postMessage({
          type: 'progress',
          stage: 'transcode',
          bitrateKbps: br,
          ratio: p.progress,
        } satisfies EncodeProgress);
      };
      ff.on('progress', onProgress);
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
      ff.off('progress', onProgress);
      const data = (await ff.readFile(outName)) as Uint8Array;
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

export {};
