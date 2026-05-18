# apps/api

Cloudflare Workers + Hono. RESTful API.

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
| POST | `/lyrics/:id/request-music` | 음악 생성 요청 발행 | ✓ 본인 |
| GET | `/albums` | 앨범 목록 | - |
| GET | `/albums/:id` | 앨범 상세 (수록 항목 포함) | - |
| POST | `/albums` | 앨범 생성 | ✓ |
| PATCH | `/albums/:id` | 앨범 수정 | ✓ 본인 |
| DELETE | `/albums/:id` | 앨범 삭제 | ✓ 본인 |
| PUT | `/albums/:id/items` | 수록 항목 교체/재정렬 | ✓ 본인 |
| POST | `/uploads/sign` | R2 PUT용 presigned URL | ✓ |
| GET | `/generation/me/requests` | 내 음악 생성 요청 목록 | ✓ |
| GET | `/generation/admin/queue` | 어드민 큐 | ✓ admin |
| PATCH | `/generation/admin/:id` | 요청 상태 변경 (배정/완료) | ✓ admin |
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
