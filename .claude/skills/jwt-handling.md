# JWT 발급과 검증

> 자체 HS256 JWT 발급/검증/리프레시 로직.

## 언제 사용하는가

- 인증 관련 코드를 수정할 때
- 토큰 만료 정책을 바꿀 때
- 새로운 클레임(권한, 워크스페이스 등)을 추가할 때

## 설계 원칙

- **HS256, 단일 서비스** — RS256은 키 회전 부담 vs 이득이 부족
- **access 1시간, refresh 30일** — 환경 변수로 조정 가능
- **refresh는 DB 저장, access는 stateless** — refresh는 SHA-256 해시만 저장 (탈취 방어)
- **refresh 회전** — 사용 시 즉시 revoke + 새 refresh 발급 (탈취 알람 효과)
- **외부 의존성 없음** — Web Crypto만 사용, Workers 호환 (`apps/api/src/services/jwt.ts`)

## 클레임 구조

```ts
interface AuthClaims {
  sub: string;       // user id
  handle: string;    // 사용자 핸들 (UI 표시용)
  isAdmin: boolean;  // 어드민 라우트 가드
  iat: number;       // unix seconds
  exp: number;       // unix seconds
}
```

핸들은 사용자가 바꿀 수 있으므로, 캐싱 가치는 짧음. 토큰 만료(1h)와 균형. 권한(isAdmin)은 자주 바뀌지 않음.

## 발급/검증 함수

- `signAccessToken(claims, env)` → `{ token, expiresAt }`
- `verifyAccessToken(token, env)` → `AuthClaims | null` (만료/서명 불일치 시 null)
- `issueRefreshToken(env)` → `{ token, tokenHash, expiresAt }` (DB엔 tokenHash만 저장)
- `hashRefreshToken(token)` → SHA-256 hex (검증용)

## 미들웨어

```
attachUser  (모든 라우트)
  └─ Authorization: Bearer ... 또는 chohee_at 쿠키에서 토큰 추출
     └─ verifyAccessToken → 성공 시 c.set('user', claims)

requireAuth   → c.get('user') 없으면 401
requireAdmin  → user.isAdmin 아니면 403
```

## 리프레시 흐름

```
[웹 SvelteKit] /auth/refresh +server.ts (쿠키의 chohee_rt 사용)
  └─ Workers: tokenHash로 refresh_tokens 조회
     ├─ 없거나 revokedAt 있거나 만료 → 401
     ├─ revokedAt 설정 (회전)
     ├─ 새 refresh 발급 + DB insert
     ├─ 새 access 발급
     └─ Set-Cookie로 둘 다 갱신
```

웹 클라이언트는 401을 받았을 때 자동으로 `/auth/refresh`를 호출 후 원래 요청을 재시도하는 인터셉터를 추가하는 것이 자연스러움 (Phase 1 기본 클라이언트는 단순). 후속에서 자동 재시도 도입 가능.

SvelteKit `+server.ts`로 client-facing refresh endpoint를 두고 내부에서 Workers API와 통신 — same-origin cookie 흐름 유지.

## 보안 체크

- `JWT_SECRET`은 32바이트 이상 (예: `openssl rand -base64 48`)
- 절대 클라이언트로 secret 노출 금지 (코드, 빌드 산출물, 환경 변수 prefix 주의 — `NEXT_PUBLIC_`이 아닌 변수만 사용)
- refresh token을 DB에서 평문으로 가지면 DB 유출 시 곧 인증 우회 가능 → 항상 해시만 저장
- 로그아웃 시 refresh 토큰을 DB에서 revoke (현재 구현)

## 흔한 함정

- access token 만료를 너무 짧게 잡으면 사용성 저하, 너무 길게 잡으면 탈취 위험 ↑ → 1h가 안정적인 균형
- HS256 sign/verify는 동일 비밀키 사용. 키 회전 시에는 기존 토큰들이 즉시 무효화됨 → 점진 회전이 필요하면 키 ID(`kid`) 헤더 추가 검토
- 서버 시간 동기화가 어긋나면 토큰이 즉시 만료/유효 처럼 보일 수 있음 — Workers는 보통 정확하지만 검증 시 작은 leeway 고려
