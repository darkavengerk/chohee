# 카카오 OAuth 흐름

> 카카오 로그인부터 자체 JWT 발급, 쿠키 설정, 토큰 회전까지의 전체 흐름. **Web은 SvelteKit, API는 Cloudflare Workers + Hono.**

## 언제 사용하는가

- `/auth/*` 라우트를 수정할 때
- 로그인/로그아웃/리프레시 동작을 디버깅할 때
- 새 OAuth 제공자(Apple, Google)를 추가할 때

## 보안 절대 규칙

- **카카오 access token은 절대 클라이언트에 노출하지 말 것.** Workers에서 사용 직후 폐기. DB에도 저장하지 않음 (`auth_providers.rawProfile`에 프로필 응답만).
- **자체 JWT는 httpOnly + SameSite=Lax 쿠키.** localStorage 금지.
- **state 파라미터로 CSRF 방지.** Phase 1은 stateless. 후속 강화 항목.
- **client_secret은 wrangler secret으로 등록.** 코드/wrangler.toml에 평문 금지.

## 전체 흐름

```
[웹 SvelteKit] /login (+page.svelte)
  └─ 카카오 버튼 클릭
     └─ GET /auth/kakao/url (Workers API) → {url, state}
        └─ window.location = url  (카카오 인증 페이지)
           └─ 사용자가 동의 → 카카오가 redirect_uri로 ?code=... 리다이렉트
              └─ [웹] /auth/kakao/callback (+server.ts, SvelteKit endpoint)
                 └─ fetch POST /auth/kakao { code }  (Workers API)
                    ├─ 카카오 token endpoint에 code → access_token 교환
                    ├─ /v2/user/me로 프로필 조회
                    ├─ access_token 폐기 (변수만 사용, DB 저장 X)
                    ├─ users + auth_providers 신규/조회
                    ├─ JWT access (1h) + refresh (30d) 발급
                    └─ Set-Cookie 2개 (chohee_at, chohee_rt) 반환
                 └─ SvelteKit endpoint가 같은 도메인으로 cookies.set
                 └─ throw redirect(303, '/me')
```

## SvelteKit callback endpoint

`apps/web/src/routes/auth/kakao/callback/+server.ts`:

```ts
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const errorParam = url.searchParams.get('error');
  if (errorParam || !code) {
    throw redirect(303, `/login?error=${encodeURIComponent(errorParam ?? 'missing_code')}`);
  }

  const apiRes = await fetch(`${privateEnv.API_BASE_URL}/auth/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!apiRes.ok) {
    throw redirect(303, `/login?error=api_${apiRes.status}`);
  }

  // API의 Set-Cookie를 SvelteKit 도메인 쿠키로 재발급
  const setCookieHeaders = apiRes.headers.getSetCookie?.() ?? [];
  for (const cookieStr of setCookieHeaders) {
    // 간단 파서: name=value; attr=val; ... → cookies.set
    const [pair, ...attrs] = cookieStr.split(';').map((s) => s.trim());
    const [name, ...rest] = pair.split('=');
    const value = rest.join('=');
    cookies.set(name, value, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
      maxAge: attrs.some((a) => /^max-age=/i.test(a))
        ? Number(attrs.find((a) => /^max-age=/i.test(a))!.split('=')[1])
        : undefined,
    });
  }
  throw redirect(303, '/me');
};
```

## 환경 변수

### Workers (API)
```
KAKAO_CLIENT_ID=          # 카카오 개발자 콘솔의 REST API 키
KAKAO_CLIENT_SECRET=      # 콘솔에서 활성화 + 생성한 값
KAKAO_REDIRECT_URI=       # 콘솔에 등록한 redirect uri와 정확히 일치
JWT_SECRET=               # 32바이트 이상 임의 문자열
JWT_ACCESS_TTL_SECONDS=3600
JWT_REFRESH_TTL_SECONDS=2592000
WEB_ORIGIN=               # 쿠키 secure/도메인/CORS에 사용
```

`wrangler secret put KAKAO_CLIENT_ID` 식으로 등록.

### Web (SvelteKit)
```
API_BASE_URL=             # 서버 측만 사용 (private). $env/dynamic/private에서 read.
PUBLIC_API_BASE_URL=      # 클라이언트도 접근. 가능한 한 서버 endpoint를 프록시로 두고 클라이언트는 같은 origin 호출.
```

`PUBLIC_` 접두사가 있으면 클라이언트 번들에 노출 — 절대 secret을 `PUBLIC_*`로 두지 말 것.

## 카카오 콘솔 체크리스트

- 애플리케이션 생성 → REST API 키 복사
- 카카오 로그인 활성화
- Redirect URI 등록:
  - 로컬: `http://localhost:5173/auth/kakao/callback`
  - 프로덕션: `https://<pages-project>.pages.dev/auth/kakao/callback`
- 동의 항목: 닉네임(필수), 프로필 이미지(선택), 이메일(선택, 검수 필요)
- Client Secret 활성화 → 값 복사

## JWT 구조

- HS256, 헤더 + payload(`{sub, handle, isAdmin, iat, exp}`) + 서명
- access는 1시간, refresh는 30일
- refresh는 절대 그대로 DB에 저장하지 않음 — SHA-256 해시만 `refresh_tokens.tokenHash`에 저장
- 회전 정책: refresh 사용 시 즉시 revoke + 새 refresh 발급 (탈취 시 한 번만 동작)

## 쿠키 옵션 (API에서 발급)

```ts
{
  httpOnly: true,
  secure: WEB_ORIGIN.startsWith('https://'),
  sameSite: 'Lax',
  path: '/',
  expires: accessExpiresAt | refreshExpiresAt,
}
```

## Cross-site 쿠키 함정과 우회

`*.pages.dev`와 `*.workers.dev`는 eTLD+1이 달라 cross-site. `SameSite=Lax` 쿠키는 cross-site fetch에 안 실림. 그래서:

1. **클라이언트는 API를 직접 호출하지 않는다.** SvelteKit endpoint(`+server.ts`)나 server load(`+page.server.ts`)에서 fetch.
2. **callback에서 cookie 재발급**: API의 `Set-Cookie`를 그대로 받아 같은 origin(web)에서 다시 set. 그러면 이후 web → API server-side 호출 시 cookie가 web 도메인에 있어서 SvelteKit이 forward 가능.
3. **SvelteKit server fetch는 cookie를 자동 전달하지 않는다** — `event.fetch`나 `event.cookies.getAll()` 후 명시적으로 Authorization 헤더로 변환하거나, API에 server-to-server 토큰 검증 채널을 둠.

Phase 1 권장 패턴: web의 server endpoint에서 `event.cookies.get('chohee_at')`을 꺼내 `Authorization: Bearer ...` 헤더로 API에 전달. 이러면 cookie 보안은 유지하면서 cross-site 문제도 회피.

## 새 OAuth 제공자 추가하기

1. `AUTH_PROVIDERS` 상수에 추가
2. `services/<provider>.ts` 작성 (token 교환, 프로필 조회, providerUserId 결정)
3. `/auth/<provider>` 라우트 추가 — `/auth/kakao`와 동일한 패턴
4. 동일 `auth_providers` 테이블에 새 row 삽입 (`provider`, `providerUserId` unique)

기존 user에 새 provider를 연결하는 흐름(같은 이메일이면 자동 머지?)은 별도 결정 필요 — Phase 3.

## 흔한 함정

- redirect_uri가 콘솔 등록값과 1바이트라도 다르면 즉시 실패
- `Set-Cookie`가 cross-origin이면 third-party cookie로 차단됨 → SvelteKit endpoint에서 same-origin으로 다시 set
- 카카오 사용자에게 이메일이 없을 수 있음 (`users.email` nullable)
- 로컬에서 HTTPS 없이 `secure: true`로 쿠키를 set하면 브라우저가 무시 → `WEB_ORIGIN`이 http면 자동으로 secure: false
- SvelteKit의 `cookies.set`은 path를 명시하지 않으면 현재 경로 기준 → 항상 `path: '/'` 지정
