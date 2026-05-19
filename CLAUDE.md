# CLAUDE.md

> 이 파일은 Claude Code가 이 저장소에서 작업할 때마다 읽고 따라야 할 프로젝트 컨텍스트와 규칙을 정의한다. 코드 작성 전에 반드시 이 문서와 `MILESTONES.md`, 그리고 `.claude/skills/` 디렉토리의 관련 스킬을 함께 참고할 것.

## 프로젝트 한 줄 요약

AI로 만든 음악을 공유하는 스트리밍 플랫폼. 동시에 **가사가 음악이 되는 공간**으로, 사용자가 가사만 올리면 **다른 사용자들이 그 가사에 음악을 입혀 제안**하고, **가사 작성자가 그중 하나를 채택**하는 커뮤니티 기반 음악 생성 모델을 지원한다. 앨범 개념으로 통일성 있는 컨셉의 묶음 관리도 함께 지원한다.

## 작업 시 항상 지켜야 할 원칙

### 1. 마일스톤 문서 우선 참고

코드 작성 전 반드시 `MILESTONES.md`를 확인하여 현재 작업이 어느 Phase에 속하는지, 다음 Phase에서 어떻게 확장될지 파악한다. 현재 Phase의 범위를 넘어서지 않되, 미래 확장이 자연스럽도록 설계한다.

### 2. 콘텐츠 모델의 세 형태를 항상 의식

이 서비스의 콘텐츠는 다음 세 가지가 있다:
- **트랙(Track)**: 오디오 파일이 있는 곡
- **가사(Lyrics)**: 텍스트만 있는 콘텐츠 (음악으로 변환 대기 가능)
- **앨범(Album)**: 트랙과 가사를 묶는 컨테이너

API, UI, DB 스키마 어디서든 "트랙 위주"로만 생각하면 안 된다. 가사는 1급 콘텐츠이며 독립적으로 존재할 수 있다.

### 3. 음악 생성 워크플로 — 커뮤니티 제안 + 채택 모델

가사 → 음악 변환은 **다른 사용자들이 자유롭게 제안하고, 가사 작성자가 그중 하나를 채택**하는 모델이다. 운영자는 음악을 만들지 않고 모더레이션과 운영만 담당한다. 한 가사에 여러 후보 트랙이 공존하다가, 작성자가 하나를 채택하면 그 트랙이 그 가사의 "공식 음원"이 된다 (채택되지 않은 후보들도 별도 트랙으로 계속 존재할 수 있다).

코드 흐름 (의도된 Phase 2 모델):

1. 사용자가 가사 작성 시 "음악 제안 받기" 옵션 선택 가능 → 가사가 "음악 기다리는 가사" 피드에 노출
2. 요청 발행 시 `music_generation_requests` 레코드 생성 (status: `open`)
3. **다른 사용자**가 그 가사 페이지에서 "음악 제안하기" 흐름 진입 → 외부 AI 도구(Suno 등) 또는 직접 작곡으로 음원 제작 → 곡 업로드 시 해당 가사에 연결되는 **제안(submission)** 으로 등록
4. 가사 작성자에게 새 제안 알림 → 작성자는 후보들을 들어보고 그중 하나를 **채택(adopt)** 하거나, 더 기다리거나, 요청을 닫을 수 있음
5. 채택된 트랙은 가사의 공식 음원이 됨 → 제안자와 작성자 모두에게 알림, 크레딧 표시

운영자의 역할: 부적절한 제안 모더레이션, 신고 처리, 저작권 분쟁 중재. **운영자가 음악 후보를 만들지 않는다.**

자동화 (Phase 3): 같은 인터페이스(제안 등록 API)에 "AI 자동 제안" 처리기를 붙여 사용자가 자기 가사에 한해 즉시 후보를 받아볼 수 있게 한다. 자동 제안과 커뮤니티 제안은 동등하게 공존한다.

**Phase 1 상태**: 코드의 `music_generation_requests` 테이블은 위 모델의 1단계(요청 발행)까지만 표현한다. 후보 제안(`music_submissions`)과 채택(`adopted_track_id`) 구조는 Phase 2에서 추가한다. 현재 어드민 큐 엔드포인트는 모더레이션 도구로 의미가 재정의된다 (음악을 만드는 도구가 아님).

### 4. 디자인 시스템은 처음부터 적용

별도로 제공되는 디자인 시스템(`packages/ui`)을 Phase 1부터 사용한다. 페이지나 컴포넌트에서 색상/사이즈/간격을 하드코딩하지 않고 항상 토큰을 거친다. "나중에 디자인 적용"이라는 단계는 없다.

## 스킬 사용과 분리 원칙

`.claude/skills/` 디렉토리에 작업별 세부 절차와 지식을 스킬 파일로 분리한다. 이 파일(`CLAUDE.md`)에는 **항상 적용되는 큰 원칙만** 두고, 세세한 절차나 패턴은 스킬로 빼서 필요할 때만 로드한다.

### 작업 시 스킬 활용

작업 시작 전에 `.claude/skills/` 디렉토리를 확인하고, 현재 작업과 관련된 스킬 파일을 먼저 읽는다. 예시:

- 카카오 OAuth 흐름을 구현한다면 → `.claude/skills/kakao-oauth.md` 확인
- ffmpeg.wasm 통합 작업이라면 → `.claude/skills/ffmpeg-wasm.md` 확인
- D1 마이그레이션을 다룬다면 → `.claude/skills/d1-migrations.md` 확인
- SvelteKit 라우팅/SSR/load 패턴을 다룬다면 → `.claude/skills/sveltekit-patterns.md` 확인

스킬 파일이 아직 없는 영역에 대한 작업이라면 코드만 작성하고, 작업 완료 후 "이 영역에 스킬을 만들지" 사용자에게 제안한다.

### 스킬로 분리해야 할 것들

작업 중 다음에 해당하는 내용을 발견하면 스킬로 분리할 후보로 표시한다:

- **반복적으로 참조되는 세부 절차**: 카카오 OAuth 콜백 흐름, R2 서명된 URL 생성 코드 패턴, JWT 발급/검증 로직, ffmpeg.wasm 호출 방식, SvelteKit load/action 패턴
- **외부 시스템 통합의 세부사항**: 카카오 API 응답 구조, Suno API 호출 방법 (Phase 3), Cloudflare 리소스 생성/설정 절차
- **자주 변경 가능성이 있는 구현 디테일**: R2 객체 키 명명 규칙, 에러 코드 체계, 페이지네이션 패턴
- **도메인 지식 중 깊이 있는 부분**: 음악 메타데이터 형식, LUFS 측정 알고리즘, 파형 데이터 구조
- **검증/테스트 시나리오**: Phase별 검증 체크리스트, 수동 QA 절차

### 스킬로 분리하지 말아야 할 것

다음은 `CLAUDE.md`에 남겨둔다:

- 프로젝트의 핵심 비전과 정체성
- 모든 코드에 적용되는 컨벤션 (TypeScript strict, 네이밍 등)
- 보안 원칙
- 모노레포 구조
- 콘텐츠 모델의 큰 그림

### CLAUDE.md 업데이트 시 판단

작업 완료 후 새로 알게 된 내용을 어디에 기록할지 판단:

1. 모든 작업에 영향을 주는 **원칙/규칙** → `CLAUDE.md`
2. 특정 영역의 **세부 절차/패턴** → `.claude/skills/<영역>.md`
3. **현재 진행 상황** → `MILESTONES.md`의 해당 Phase

`CLAUDE.md`가 비대해지지 않도록 주의한다. 100줄을 넘는 영역별 상세 내용이 들어가려고 하면 스킬로 분리한다.

### 스킬 파일 형식

```markdown
# <스킬 이름>

> 한 줄 요약

## 언제 사용하는가

이 스킬은 다음 작업 시 참고한다:
- ...

## 핵심 개념

(필요 시)

## 구체적 절차/패턴

```

스킬 파일은 자기 완결적으로 작성한다. CLAUDE.md를 다시 읽지 않아도 그 영역의 작업을 수행할 수 있게.

## 기술 스택 (고정)

| 영역 | 선택 | 비고 |
|------|------|------|
| 프론트엔드 | SvelteKit (Svelte 5 runes) + TypeScript + Tailwind | Server-first SSR. `+page.svelte`/`+page.server.ts`/`+server.ts` 패턴 |
| 어댑터 | `@sveltejs/adapter-cloudflare` | Cloudflare Pages Functions로 빌드 |
| 백엔드 | Cloudflare Workers + Hono | RESTful API |
| DB | Cloudflare D1 + Drizzle ORM | SQLite 기반 |
| 스토리지 | Cloudflare R2 | S3 호환, egress 무료 |
| 인증 | 카카오 OAuth + 자체 JWT | httpOnly 쿠키. web과 api가 같은 eTLD+1 도메인이거나, web이 API를 server-side로 프록시 |
| 오디오 처리 | ffmpeg.wasm (Web Worker), Web Audio API | 서버 트랜스코딩 없음 |
| 패키지 관리 | pnpm + Turborepo | 모노레포 |

### 왜 SvelteKit인가 (기록)

초기에 Next.js 14로 시작했으나 Cloudflare Pages 배포 시 `@cloudflare/next-on-pages`의 deep webpack 호환성 문제로 빌드 fail. Next 15 + adapter 업그레이드/Vercel 이전 모두 검토했으나, **Cloudflare 1급 호환** + **번들/성능** + **장기 유지보수 관점**에서 SvelteKit으로 갈아탔다. 2026-05-19 결정.

## 모노레포 구조

```
apps/
  web/          # SvelteKit 프론트엔드 (사용자용). adapter-cloudflare로 빌드 → Cloudflare Pages
  api/          # Cloudflare Workers + Hono
  admin/        # 운영자 어드민 (Phase 2부터)
packages/
  shared/       # 공유 타입, 상수, 유틸 (양쪽에서 import)
  db/           # Drizzle 스키마, 마이그레이션, 쿼리 헬퍼
  ui/           # 디자인 시스템 토큰 + Svelte 컴포넌트
```

새 코드를 만들 때 어디에 둘지 명확히 결정한다. 타입은 가능한 한 `packages/shared`에 두어 양쪽에서 공유.

### SvelteKit 라우팅 핵심

- `apps/web/src/routes/+page.svelte` — 페이지 (홈은 `/`)
- `apps/web/src/routes/+page.server.ts` — 서버 측 load (cookies, DB, 외부 API)
- `apps/web/src/routes/+page.ts` — universal load (서버에서 첫 렌더, 이후 클라이언트에서도)
- `apps/web/src/routes/+layout.svelte` / `+layout.server.ts` — nested layout
- `apps/web/src/routes/api/auth/kakao/callback/+server.ts` — API endpoint (Workers와 별개 — 같은 origin OAuth callback용)
- `apps/web/src/hooks.server.ts` — 모든 요청에 적용되는 hook (auth/cors/headers)

## 코딩 컨벤션

### 언어 사용

- **코드 식별자(변수, 함수, 파일명, 타입)는 영어**
- **주석과 커밋 메시지는 한국어 우선**, 단 영어 표현이 더 명확하면 영어
- **UI 텍스트는 한국어 기본**, 향후 i18n 확장 가능하게 키 기반 관리 권장

### TypeScript

- `strict: true` 필수
- `any` 사용 금지 (외부 라이브러리 타입 부재 등 불가피한 경우만, 주석 필수)
- API 요청/응답은 Zod로 런타임 검증 + 타입 추출
- SvelteKit의 `PageServerLoad`, `Actions`, `RequestHandler` 타입은 `./$types`에서 import

### Svelte 컴포넌트

- **Svelte 5 runes 우선**: `$state`, `$derived`, `$effect`, `$props`, `$bindable`
- 상태가 있는 컴포넌트: `let count = $state(0);`
- 외부 입력: `let { value, oninput }: Props = $props();`
- 부수 효과: `$effect(() => { ... });`
- `export let` (Svelte 4 패턴)은 사용 금지 — 새 컴포넌트는 runes로

### 코드 스타일

- ESLint + Prettier (prettier-plugin-svelte) 자동 적용
- 명시적 에러 처리
- 매직 넘버/문자열은 상수로 분리 (`packages/shared/constants`)

## 보안 원칙

- **카카오 access token은 절대 클라이언트에 노출 금지**. Workers에서만 사용하고, 클라이언트엔 자체 JWT만 전달.
- **JWT는 httpOnly + Secure + SameSite=Lax 쿠키에 저장**. localStorage 사용 금지.
- **JWT 시크릿, 카카오 클라이언트 시크릿 등은 환경 변수**. 코드 하드코딩 금지. `.env.example`만 커밋.
- **R2 객체는 서명된 URL로만 접근**. public 버킷 금지. 만료 시간은 1-6시간.
- **R2 업로드 시 서버 측 검증**: 파일 크기 상한, MIME 타입, 사용자 권한 확인 후 서명된 URL 발급.
- **모든 mutation API는 인증 미들웨어 통과 필수**.
- **권한 확인**: 자기 콘텐츠만 수정/삭제. 어드민 권한은 별도 미들웨어.
- **SQL 인젝션 방지**: Drizzle 쿼리 빌더 사용, raw SQL은 prepared statement만.
- **Cross-site 쿠키 주의**: web과 api가 서로 다른 eTLD+1(`*.pages.dev`와 `*.workers.dev`)이면 `SameSite=Lax`로는 cookie가 안 감. SvelteKit의 서버 endpoint(`+page.server.ts`/`+server.ts`)에서 API를 호출하면 same-origin 흐름이 되므로 인증 토큰을 유지할 수 있다. 클라이언트에서 직접 API를 호출하는 경우는 최소화하고, 어쩔 수 없을 때는 SvelteKit endpoint를 프록시로 사용한다.

## 디자인 시스템

`packages/ui`에서 토큰과 컴포넌트를 import한다. 페이지 코드에서 직접 색상/사이즈를 적지 않는다.

```svelte
<!-- 좋음 -->
<button class="bg-accent text-accent-fg">

<!-- 나쁨 -->
<button class="bg-[#D4823A] text-white">
```

세부 토큰 매핑과 사용 가이드는 `.claude/skills/design-system.md`를 참조.

## 작업 시작 체크리스트

새 작업을 시작할 때마다:

- [ ] `MILESTONES.md`에서 현재 Phase 범위 확인
- [ ] `.claude/skills/`에서 관련 스킬 파일 확인
- [ ] 콘텐츠 모델 세 형태(트랙/가사/앨범)에 일관되게 적용되는지 점검
- [ ] 보안 원칙 위반 없는지 점검
- [ ] DB 변경이 있으면 마이그레이션 파일 생성

## 작업 완료 시 체크리스트

- [ ] 타입 에러 없음 (`pnpm typecheck`)
- [ ] 린트 통과 (`pnpm lint`)
- [ ] SvelteKit 빌드 통과 (`pnpm --filter @chohee/web build`)
- [ ] 관련 테스트 작성/통과
- [ ] 환경 변수 변경이 있으면 `.env.example` 업데이트
- [ ] 새로 발견한 패턴/지식이 있다면 스킬로 분리할지 또는 `CLAUDE.md`에 추가할지 판단
  - 반복 참조될 세부 절차 → 스킬
  - 모든 작업에 적용되는 원칙 → CLAUDE.md
- [ ] Phase 완료에 가까워졌다면 `MILESTONES.md`의 검증 기준 확인

## 흔히 하는 실수 (피할 것)

- 가사 없이 트랙만 고려한 스키마/UI 작성 → **가사는 1급 콘텐츠**
- 트랙 단독으로 페이지 만들기 → 앨범 컨텍스트도 고려
- Workers에서 큰 파일 처리 시도 → R2 직접 업로드/다운로드 사용
- D1에 재생 이벤트 같은 대량 로그 저장 → Analytics Engine 사용
- localStorage에 토큰 저장 → httpOnly 쿠키만
- 클라이언트에서 카카오 토큰 들고 API 호출 → 자체 JWT로 전환된 후 호출
- 카카오 사용자에게 이메일 필수 가정 → nullable로 처리
- 음악 생성을 가사 작성자나 운영자만 할 수 있다고 가정 → **다른 사용자**가 제안하는 커뮤니티 모델
- 가사 하나에 음악이 하나뿐이라고 가정 → 한 가사에 여러 후보 제안이 공존, 작성자가 하나 채택
- 음악 후보 제안 페이지를 운영자 전용으로 설계 → 누구나 진입 가능, 단 채택은 가사 작성자만
- 음악 생성을 즉시 처리 가정 → 비동기 제안/채택 모델
- 색상/사이즈 하드코딩 → 디자인 토큰 경유
- 세세한 절차를 `CLAUDE.md`에 누적 → 스킬로 분리
- 클라이언트에서 API 직접 호출 후 cross-site 쿠키 문제로 fail → SvelteKit endpoint를 프록시로 활용
- `export let` (Svelte 4) 사용 → `$props()` (Svelte 5 runes)
- `onMount` 안에서 모든 부수효과 처리 → 더 적합한 `$effect`나 `+page.ts` load 함수 사용
