# apps/api

Cloudflare Workers + Hono. RESTful API.

> **음악 생성 정책 메모.** Phase 1은 "가사 작성자가 음악을 받고 싶다"는 의향을 발행하는 데까지(`/lyrics/:id/request-music`)만 구현. Phase 2에서 **다른 사용자가 그 가사에 음악을 제안**하고 **가사 작성자가 채택**하는 흐름이 추가될 예정 (`/lyrics/:id/submissions`, `/lyrics/:id/adopt/:submissionId` 등). 운영자는 음악을 만들지 않으며 `/generation/admin/*`는 Phase 2에서 모더레이션 도구로 재정의된다. 상세는 [MILESTONES.md](../../MILESTONES.md)의 Phase 2 섹션 참조.

## 개발 실행

```bash
pnpm --filter @chohee/api dev
# → http://localhost:8787
```

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|---|---|---|---|
| GET | `/health` | 헬스체크 | - |
| GET | `/auth/kakao/url` | 카카오 인증 URL 생성 | - |
| POST | `/auth/kakao` | 인증 코드 → JWT 쿠키 발급 | - |
| POST | `/auth/refresh` | refresh로 access 재발급 (회전) | refresh 쿠키 |
| POST | `/auth/logout` | refresh revoke + 쿠키 삭제 | - |
| GET | `/me` | 현재 사용자 정보 | ✓ |
| PATCH | `/me` | 프로필 수정 | ✓ |
| GET | `/tracks` | 트랙 목록 (cursor pagination) | - |
| GET | `/tracks/:id` | 트랙 상세 | - |
| POST | `/tracks` | 트랙 생성 | ✓ |
| PATCH | `/tracks/:id` | 트랙 수정 | ✓ 본인 |
| DELETE | `/tracks/:id` | 트랙 삭제 | ✓ 본인 |
| GET | `/lyrics` | 가사 목록 | - |
| GET | `/lyrics/:id` | 가사 상세 | - |
| POST | `/lyrics` | 가사 작성 | ✓ |
| PATCH | `/lyrics/:id` | 가사 수정 | ✓ 본인 |
| DELETE | `/lyrics/:id` | 가사 삭제 | ✓ 본인 |
| POST | `/lyrics/:id/request-music` | "음악 제안 받기" 의향 발행 (커뮤니티 제안 모집 시작) | ✓ 본인 |
| GET | `/albums` | 앨범 목록 | - |
| GET | `/albums/:id` | 앨범 상세 (수록 항목 포함) | - |
| POST | `/albums` | 앨범 생성 | ✓ |
| PATCH | `/albums/:id` | 앨범 수정 | ✓ 본인 |
| DELETE | `/albums/:id` | 앨범 삭제 | ✓ 본인 |
| PUT | `/albums/:id/items` | 수록 항목 교체/재정렬 | ✓ 본인 |
| POST | `/uploads/sign` | R2 PUT용 presigned URL | ✓ |
| GET | `/generation/me/requests` | 내 음악 제안 요청 목록 | ✓ |
| GET | `/generation/admin/queue` | 어드민 큐 (Phase 2에서 **모더레이션 큐**로 의미 재정의 — 운영자가 음악을 만들지 않음) | ✓ admin |
| PATCH | `/generation/admin/:id` | 요청 상태 변경 — Phase 1 호환용 (Phase 2에서 채택/감추기 액션으로 교체) | ✓ admin |
| GET | `/users/:handle` | 공개 프로필 | - |

## 응답 형식

성공:
```json
{ "ok": true, "data": { ... } }
```

실패:
```json
{ "ok": false, "error": { "code": "VALIDATION", "message": "...", "details": { ... } } }
```

에러 코드: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, `CONFLICT`, `RATE_LIMIT`, `INTERNAL`.

## 비밀 값 등록

```bash
wrangler secret put KAKAO_CLIENT_ID
wrangler secret put KAKAO_CLIENT_SECRET
wrangler secret put JWT_SECRET
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
```

평문 vars는 `wrangler.toml`에 직접 작성 (도메인, 만료 시간 등).
