# ffmpeg.wasm 통합

> 브라우저에서 음원을 멀티 비트레이트(128/192/320kbps AAC)로 인코딩하고 LUFS를 측정하는 방법.

## 언제 사용하는가

- 곡 업로드 페이지를 수정할 때
- 인코딩 옵션을 바꾸거나 새 비트레이트를 추가할 때
- 인코딩 성능/메모리 문제를 디버깅할 때

## 핵심 설계

- **Web Worker에서 실행** — 본 스레드를 막지 않음. `apps/web/workers/encoder.ts`가 메인 워커.
- **SharedArrayBuffer 필수** — `next.config.mjs`에서 COOP/COEP 헤더 설정:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`
- **ffmpeg.wasm 코어는 CDN에서 로드** — `unpkg.com/@ffmpeg/core@0.12.6`. 자체 호스팅하려면 R2에 올려서 동일 origin으로 서빙 (CORP 헤더 주의).
- **인코딩 결과는 ArrayBuffer로 메인 스레드에 전송** — `postMessage(data, [transferableList])`로 zero-copy 전송.

## 메시지 프로토콜

```ts
// → worker
type EncodeRequest = {
  type: 'encode';
  fileBuffer: ArrayBuffer;
  filename: string;
  bitratesKbps: ReadonlyArray<128 | 192 | 320>;
};

// ← worker
type EncodeProgress = {
  type: 'progress';
  stage: 'init' | 'transcode' | 'measuring';
  bitrateKbps?: number;
  ratio?: number; // 0..1
};
type EncodeResult = {
  type: 'done';
  renditions: { bitrateKbps; buffer: ArrayBuffer; mimeType: string }[];
  durationSeconds: number;
  loudnessLufs: number | null;
};
type EncodeError = { type: 'error'; message: string };
```

## 명령어

- 인코딩: `ffmpeg -y -i <input> -vn -c:a aac -b:a <br>k -movflags +faststart out_<br>.m4a`
- 길이 측정: `ffmpeg -i <input> -f null -` 의 로그에서 `Duration: HH:MM:SS.ss` 파싱
- LUFS 측정: `ffmpeg -i <input> -af ebur128=peak=true -f null -` 의 로그에서 `I: -XX.XX LUFS` 파싱

## 메모리 주의

- 매우 긴 곡(15분+)은 ffmpeg.wasm WebAssembly 메모리 한계에 가까워질 수 있음. 청크 처리 검토 필요.
- 사용 후 `ffmpeg.deleteFile(name)`으로 가상 FS 정리.
- 워커 종료 시 `worker.terminate()` 호출 (페이지 unmount 시).

## CDN vs 자체 호스팅

기본은 CDN(unpkg). 안정성/속도 우려가 있으면:
1. `@ffmpeg/core` 패키지의 `dist/esm/{ffmpeg-core.js, ffmpeg-core.wasm}`를 R2 또는 자체 정적 서버로 배포
2. CORP 헤더 `cross-origin-resource-policy: cross-origin` 설정
3. 코드의 `base` 변수만 교체

## 흔한 함정

- COOP/COEP 헤더가 없으면 `SharedArrayBuffer is not defined` — Next.js config에서 강제 적용 중
- iOS Safari는 ffmpeg.wasm이 동작하지만 성능이 데스크톱 대비 매우 느림. 모바일 업로드는 Phase 3에서 처리 검토.
- 워커가 모듈로 인식되어야 import가 동작 → `new Worker(url, { type: 'module' })`
- 진행률 콜백(`ff.on('progress', ...)`)은 매 명령어마다 리스너 다시 부착 권장

## R2 업로드와의 조합

인코딩 완료된 ArrayBuffer를 Blob으로 감싸 `presigned PUT URL`로 직접 업로드. 서버를 거치지 않음 → `.claude/skills/r2-presigned-urls.md` 참조.
