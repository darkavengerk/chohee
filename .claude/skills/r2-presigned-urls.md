# R2 Presigned URL 생성과 사용

> Cloudflare R2(S3 호환)에 클라이언트가 직접 PUT 할 수 있도록 서명된 URL을 발급하는 방법.

## 언제 사용하는가

- 파일 업로드를 새로 만들거나 수정할 때
- 객체 키 명명 규칙을 바꿀 때
- 새로운 콘텐츠 타입(예: 사용자 첨부 PDF)을 받기 시작할 때

## 핵심 설계

- **AWS Signature V4를 직접 구현** — `apps/api/src/services/r2-signing.ts`. AWS SDK는 Workers 환경에서 무겁고 의존성이 커서 직접 작성.
- **PUT URL은 항상 단일 객체에 한해서만 유효** — content-type, content-length를 서명에 포함해 위변조 방지.
- **만료 1시간** — 충분히 길게 잡되 너무 길지 않게. 재시도/이어받기는 동일 URL로 가능.
- **버킷 public 금지** — 다운로드도 presigned GET URL을 사용 (`presignR2GetUrl`).

## 흐름

```
[웹] 인코딩 완료
  └─ POST /uploads/sign { kind, contentType, contentLength, scope, resourceId? }
     └─ Workers: 권한 확인 + 객체 키 생성 + 서명
        └─ { key, url, method: 'PUT', headers, expiresAt }
  └─ PUT url + headers + Blob body  (XHR로 진행률 추적)
     └─ 성공 시 key를 트랙/가사 메타데이터로 함께 저장
```

## 객체 키 명명 규칙

`apps/api/src/services/r2-signing.ts:buildObjectKey`:

- 곡 오디오: `tracks/{userId}/{resourceId}/audio/{ts}_{filename}`
- 파형 메타: `tracks/{userId}/{resourceId}/meta/{ts}_waveform.json`
- 커버: `covers/{userId}/{resourceId}/{ts}_{filename}`
- 가사 첨부: `lyrics/{userId}/{resourceId}/{ts}_{filename}`

userId/resourceId prefix로 누가 어떤 자원에 속한 파일인지 즉시 식별 가능 → 보안 점검/삭제 작업에 유리.

## 환경 변수

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=chohee-media
```

R2 콘솔에서 API 토큰 발급 시 "Object Read & Write" 권한 부여 후 S3 호환 자격증명 복사.

## 보안 체크

- 서명 전 `kind` ↔ `contentType` 일치 검증 (audio MIME ↔ 'audio', image MIME ↔ 'image')
- `contentLength` 상한 (`UPLOAD_LIMITS.AUDIO_MAX_BYTES = 200MB`)
- `requireAuth` 미들웨어 통과 필수
- 사용자 본인의 리소스에만 prefix가 할당되도록 key 생성 시 `userId` 포함

## 클라이언트 측 업로드

`apps/web/src/lib/upload.ts:uploadBlobToPresignedUrl` — XHR로 진행률 콜백 받으며 PUT. fetch에는 업로드 진행률 API가 표준이 아니므로 XHR을 유지. Svelte 컴포넌트의 이벤트 핸들러나 `$effect` 내부에서 호출 (SSR 단계에서 XHR/Blob 사용 금지).

## 다운로드 (Phase 2)

`presignR2GetUrl(env, key)`로 동일 패턴. 만료 짧게 (1시간) 잡고 매번 새로 발급. 캐시는 Cloudflare 캐시 또는 CDN에서.

## 흔한 함정

- `Content-Length`를 PUT 시 누락하면 서명 불일치 (413/403)
- URL 인코딩: 객체 키의 슬래시는 유지, 그 외만 RFC3986 인코딩 (구현된 `rfc3986` 함수 참조)
- `host` 헤더는 자동으로 fetch가 채우므로 별도 set 금지. 서명 계산엔 포함.
- 만료 시간이 지나면 fetch가 403. 페이지에서 재발급 흐름 필요.

## TODO (Phase 2+)

- 멀티파트 업로드 (5GB 이상)
- 이어받기/재개 (브라우저 새로고침 후 같은 key로 재시도)
- 업로드 직후 R2 메타데이터(Content-Type 등)로 검증
