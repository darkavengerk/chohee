# SvelteKit 패턴

> Chohee 프로젝트에서 자주 쓰이는 SvelteKit 라우팅, 데이터 로딩, 인증, 폼, 어댑터 패턴.

## 언제 사용하는가

- 새 페이지/엔드포인트를 만들 때
- 인증·보호 라우트를 다룰 때
- 폼 제출(server action)을 구현할 때
- 데이터 로딩 (load) 패턴을 선택할 때
- Cloudflare adapter 관련 설정이 필요할 때

## 라우팅 파일

| 파일 | 역할 |
|---|---|
| `+page.svelte` | 페이지 컴포넌트 |
| `+page.ts` | universal load (SSR 초기 + 클라이언트 navigation 양쪽) |
| `+page.server.ts` | server-only load + form actions (cookies/DB/secret 접근) |
| `+layout.svelte` | 중첩 레이아웃 |
| `+layout.server.ts` | layout level server load (자식 페이지에 상속) |
| `+server.ts` | API endpoint (GET/POST/PUT/PATCH/DELETE export) |
| `+error.svelte` | 해당 segment의 에러 페이지 |
| `hooks.server.ts` | 모든 요청에 적용되는 hook |

`+page.server.ts`가 있으면 `cookies`, `request`, `platform`(Cloudflare env) 사용 가능. 반면 `+page.ts`는 SSR+CSR 양쪽에서 실행되니 브라우저 전용 API 금지.

## 보호 라우트 (hooks.server.ts)

```ts
// apps/web/src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const PROTECTED = [/^\/me(\/|$)/, /^\/upload(\/|$)/, /^\/library(\/|$)/];

export const handle: Handle = async ({ event, resolve }) => {
  const at = event.cookies.get('chohee_at');
  // Workers API에 검증 위임 또는 jwt-shared 로직 사용
  event.locals.accessToken = at;

  if (!at && PROTECTED.some((re) => re.test(event.url.pathname))) {
    throw redirect(303, `/login?next=${encodeURIComponent(event.url.pathname)}`);
  }

  const response = await resolve(event);
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  return response;
};
```

`app.d.ts`에 타입 보강:

```ts
declare global {
  namespace App {
    interface Locals {
      accessToken?: string;
      user?: CurrentUser;
    }
    interface Platform {
      env?: {
        // Cloudflare Pages bindings (필요 시)
      };
    }
  }
}
export {};
```

## 데이터 로딩 (load)

### server load (cookies 필요한 경우)

```ts
// apps/web/src/routes/me/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { apiServerFetch } from '$lib/server/api';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  if (!locals.accessToken) throw error(401);
  const res = await apiServerFetch('/me', { accessToken: locals.accessToken, fetch });
  if (!res.ok) throw error(res.status);
  return { user: res.data };
};
```

### universal load (서버+클라이언트 양쪽)

```ts
// apps/web/src/routes/discover/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/discover'); // SvelteKit endpoint를 거치는 same-origin
  return { items: await res.json() };
};
```

## API endpoint (`+server.ts`)

```ts
// apps/web/src/routes/api/discover/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { apiServerFetch } from '$lib/server/api';

export const GET: RequestHandler = async ({ locals, fetch }) => {
  const res = await apiServerFetch('/discover', { accessToken: locals.accessToken, fetch });
  return json(res);
};
```

API 프록시 패턴 — Workers API에 client-facing endpoint를 그대로 노출하지 않고, SvelteKit endpoint를 한 단계 거침. 장점:
1. **Same-origin cookie**: client → SvelteKit → Workers (server-to-server). cookie 흐름 단순.
2. **단일 진입점**: 캐싱/로깅/rate limit을 web 쪽에서도 적용 가능.
3. **secret 노출 없음**: API_BASE_URL과 Authorization 형식을 web server에만 두고 client 번들에서 분리.

## Form actions

```ts
// apps/web/src/routes/me/edit/+page.server.ts
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { apiServerFetch } from '$lib/server/api';

export const actions: Actions = {
  default: async ({ request, locals, fetch }) => {
    const form = await request.formData();
    const displayName = (form.get('displayName') as string)?.trim();
    if (!displayName) return fail(400, { error: '이름을 입력하세요' });

    const res = await apiServerFetch('/me', {
      method: 'PATCH',
      body: { displayName },
      accessToken: locals.accessToken,
      fetch,
    });
    if (!res.ok) return fail(res.status, { error: res.error.message });
    throw redirect(303, '/me');
  },
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

<form method="POST" use:enhance>
  <input name="displayName" value={data.user.displayName} />
  <button>저장</button>
  {#if form?.error}<p class="text-danger">{form.error}</p>{/if}
</form>
```

## 환경 변수

SvelteKit은 `$env/*` import로 변수에 접근:

- `$env/static/private` — 빌드 타임에 inline. 서버에서만 사용.
- `$env/static/public` — 빌드 타임 inline. `PUBLIC_` 접두사. 클라이언트에도 노출.
- `$env/dynamic/private` — 런타임. 서버에서만.
- `$env/dynamic/public` — 런타임. `PUBLIC_` 접두사. 클라이언트 OK.

```ts
import { API_BASE_URL } from '$env/static/private';
```

Cloudflare Pages adapter에서는 dynamic env가 `platform.env`로 들어옴. 코드에서는 `$env/dynamic/private`가 platform.env를 자동으로 읽도록 어댑터가 처리.

## Cloudflare adapter

`apps/web/svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // 기본값으로 충분. routes/* 자동 함수화.
    }),
  },
};
```

빌드 결과: `apps/web/.svelte-kit/cloudflare/` — Cloudflare Pages가 이 디렉토리를 그대로 배포.

## Svelte 5 runes 요약

```svelte
<script lang="ts">
  // Props
  type Props = { value: string; onchange?: (v: string) => void };
  let { value, onchange }: Props = $props();

  // Local state
  let count = $state(0);

  // Computed
  let doubled = $derived(count * 2);

  // Side effects
  $effect(() => {
    console.log('count =', count);
    return () => { /* cleanup */ };
  });

  // Two-way binding
  let inputValue = $state('');
</script>

<input bind:value={inputValue} />
<button onclick={() => count++}>+1</button>
{doubled}
```

이벤트 핸들러는 attribute 형식: `onclick`, `oninput`, `onsubmit`. Svelte 4의 `on:click`은 deprecated.

## 흔한 함정

- `+page.ts`에서 `cookies`/`process.env` 접근 → 서버 전용 → `+page.server.ts`로 옮기기
- `localStorage`/`window`를 SSR 단계에서 접근 → `if (browser) { ... }` 또는 `$effect` 안에서만
- `$state`를 `<script>` 바깥에서 사용 → 컴파일 에러
- `bind:value`를 `$props()`로 받은 값에 직접 → `$bindable()` 필요
- `enhance` 없이 form 제출 → 페이지 full reload. 사용성 위해 `use:enhance` 권장
- `event.fetch` vs 전역 `fetch`: load 함수 안에서는 SvelteKit이 제공한 `fetch`를 사용해야 SSR 단계에서 cookie 자동 전달 등 동작
