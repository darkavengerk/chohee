# Phase 1 코드 작업 프롬프트

> 사용 전 준비: 저장소 루트에 `CLAUDE.md`, `MILESTONES.md`를 배치. 디자인 시스템 작업물(별도 작업)도 받아두면 Phase 1에 통합 가능.

---

## 작업 지시

먼저 `CLAUDE.md`와 `MILESTONES.md`를 읽고 프로젝트 컨텍스트와 작업 원칙을 파악해줘. 특히 스킬 분리 원칙(`.claude/skills/`)을 숙지하고, 작업 중 반복 참조될 세부 절차나 패턴이 나오면 스킬로 분리할 후보로 표시해줘.

이번 작업은 **Phase 1: 기반 + 콘텐츠 생성** 전체 범위다. `MILESTONES.md`의 Phase 1 섹션에 정의된 모든 항목을 구현한다. 작업량이 많지만 적절히 태스크로 쪼개서 진행해줘.

## Phase 1 작업 범위 요약

`MILESTONES.md`의 Phase 1 섹션을 정본으로 한다. 주요 영역:

1. **모노레포 셋업** — pnpm + Turborepo, apps(web/api) + packages(shared/db/ui)
2. **디자인 시스템 통합** — 별도 디자인 작업물의 토큰/컴포넌트를 `packages/ui`로 통합, 처음부터 모든 페이지에 적용
3. **인증** — 카카오 OAuth, 자체 JWT, 다중 OAuth 확장 가능한 스키마
4. **콘텐츠 도메인 모델** — tracks, lyrics, albums, album_items, music_generation_requests 등 전체 스키마
5. **Workers API** — 인증, 콘텐츠 CRUD, R2 업로드용 서명된 URL, 권한 검증
6. **웹 업로드 흐름** — 곡(ffmpeg.wasm 인코딩 포함), 가사, 앨범 업로드 페이지
7. **개발 환경** — Wrangler, 환경 변수, 로컬 실행

## 진행 방식

작업이 크니 다음 순서로 진행해줘. 각 단계 끝에 완료 사항을 요약하고, 중간 결정이 필요하면 합리적 기본값을 선택하고 이유를 명시한 후 진행.

### 1. 전체 계획 수립

먼저 작업 전체 계획을 정리:
- 만들 디렉토리/파일 구조
- 외부 의존성 목록과 선택 이유
- 단계별 작업 순서

### 2. 모노레포 기반

- pnpm workspaces + Turborepo
- 루트 설정 (package.json, turbo.json, tsconfig.base.json, .eslintrc, .prettierrc)
- 공유 TypeScript/ESLint/Prettier 설정
- `.gitignore`, `.env.example`

### 3. 디자인 시스템 (`packages/ui`)

별도 디자인 작업물(디자인 시스템 정의)이 있다고 가정한다. 만약 작업 시점에 디자인 시스템 결과물이 제공되지 않았다면, 다음 임시 토큰으로 시작하고 나중에 교체 가능한 구조로 만든다:

**임시 토큰 (디자인 결과물이 없을 때만 사용)**:
- 톤: 따뜻한 다크 모드
- 배경: 따뜻한 차콜 계열 (예: #1a1816, #221f1c, #2b2724의 표면 단계)
- 텍스트: 크림빛 오프화이트 (예: #f5f0e6 / #c4bdb1 / #8a8175 단계)
- 액센트: 따뜻한 앰버 (예: #d4823a 메인, #e89f5e 호버)
- 시맨틱: 성공/경고/에러는 따뜻한 톤과 조화롭게
- 폰트: Pretendard (본문/UI), 한국어 세리프(가사/디스플레이)는 폴백 포함
- 라운드: rounded-md 기본, 너무 둥글지 않게
- 간격: 4px 베이스
- 다크 모드 기본

`packages/ui` 구조:
```
src/
  tokens/        # design tokens (색상, 타이포, 간격 등)
  components/    # 베이스 컴포넌트 (Button, Input, Card, ...)
  styles/        # 글로벌 CSS, 폰트 로딩
  utils/         # cn() 등 헬퍼
tailwind.preset.js  # 다른 앱에서 import할 Tailwind 프리셋
```

핵심 컴포넌트:
- Button (variant: primary, secondary, ghost / size: sm, md, lg)
- Input, Textarea, Select
- Card
- Avatar
- Badge (음악 생성 상태 등)
- Toast
- Dialog/Modal
- Tabs
- DropZone (파일 업로드용)
- ProgressBar (인코딩/업로드 진행)

`apps/web`의 Tailwind config가 `packages/ui`의 프리셋을 확장한다.

### 4. 데이터베이스 (`packages/db`)

Drizzle ORM으로 `MILESTONES.md` Phase 1에 명시된 모든 테이블 정의:
- users, auth_providers, refresh_tokens
- tracks, lyrics, albums, album_items
- music_generation_requests

각 테이블의 인덱스, 외래 키, 제약 조건 명시. 마이그레이션 파일 생성.

D1 바인딩을 위한 헬퍼와 쿼리 함수도 이 패키지에 둔다.

### 5. Workers API (`apps/api`)

Hono 기반.

**라우트 구조**:
```
src/
  index.ts              # 엔트리, Hono 앱 구성
  routes/
    auth.ts            # /auth/*
    me.ts              # /me
    tracks.ts          # /tracks
    lyrics.ts          # /lyrics
    albums.ts          # /albums
    uploads.ts         # /uploads/sign
    generation.ts      # /lyrics/:id/request-music 등
  middleware/
    auth.ts            # JWT 검증
    cors.ts
    error.ts
  services/
    kakao.ts           # 카카오 API 호출
    jwt.ts             # JWT 발급/검증
    r2-signing.ts      # R2 presigned URL 생성
  lib/
    db.ts              # Drizzle 클라이언트
    response.ts        # 응답 형식 통일
```

**환경 변수** (wrangler.toml + secrets):
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
- `JWT_SECRET`
- `WEB_ORIGIN`
- D1 바인딩: `DB`
- R2 바인딩: `BUCKET`
- R2 액세스 키 (presigned URL용): `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`

**Phase 1에서 만들 엔드포인트는 MILESTONES.md 참조**. 모두 Zod로 요청 검증.

### 6. Next.js 프론트엔드 (`apps/web`)

App Router, 서버 컴포넌트 우선.

**페이지 구조**:
```
app/
  layout.tsx           # 루트 레이아웃, 폰트 로딩, 디자인 시스템 적용
  page.tsx             # 랜딩
  (auth)/
    login/page.tsx
  (main)/
    layout.tsx         # 헤더 등
    me/
      page.tsx         # 마이페이지
      edit/page.tsx    # 프로필 수정
    upload/
      page.tsx         # 업로드 진입 분기
      track/page.tsx   # 곡 업로드
      lyrics/page.tsx  # 가사 작성
      album/page.tsx   # 앨범 생성
middleware.ts          # 보호된 라우트
lib/
  api-client.ts        # API 호출 래퍼
  auth.ts              # 서버 측 인증 헬퍼
  kakao.ts             # 카카오 JS SDK 로딩
components/
  domain/              # 도메인 컴포넌트 (TrackUploadForm 등)
hooks/
```

**ffmpeg.wasm 통합**:
- `apps/web/workers/encoder.ts`에 Web Worker로 분리
- 업로드 페이지에서만 dynamic import (lazy load)
- Next.js config에서 COOP/COEP 헤더 설정 (SharedArrayBuffer 지원)
- 진행률 콜백으로 UI 표시

**상태 관리**:
- 서버 컴포넌트 + 쿠키 기반 인증 상태
- 필요한 곳에만 클라이언트 컴포넌트
- 복잡한 클라이언트 상태(업로드 진행, 인코딩 상태)는 Zustand 또는 Context

### 7. 스킬 파일 분리

작업 중 다음에 해당하면 `.claude/skills/<name>.md`로 분리:
- 카카오 OAuth 흐름 상세 → `.claude/skills/kakao-oauth.md`
- ffmpeg.wasm 사용법 → `.claude/skills/ffmpeg-wasm.md`
- R2 서명된 URL 생성 패턴 → `.claude/skills/r2-presigned-urls.md`
- JWT 발급/검증 상세 → `.claude/skills/jwt-handling.md`
- D1 마이그레이션 절차 → `.claude/skills/d1-migrations.md`
- 디자인 시스템 사용 가이드 → `.claude/skills/design-system.md`

각 스킬은 자기 완결적으로, 그 영역의 작업을 할 때 그 파일만 읽어도 충분하도록 작성.

### 8. 문서

- 루트 `README.md`
  - 프로젝트 소개 (MILESTONES.md, CLAUDE.md 참조)
  - 셋업 가이드 (Cloudflare 리소스 생성, 카카오 개발자 콘솔 설정, 환경 변수, D1 마이그레이션, 로컬 실행, 배포)
  - 로컬 동작 확인 시나리오
- 각 앱별 README 간단히

## 검증 시나리오

Phase 1 완료 후 다음이 동작해야 한다:

1. `pnpm install && pnpm dev`로 web/api 로컬 동시 실행
2. 카카오 로그인 → 사용자 자동 생성 → 마이페이지 진입
3. 프로필 수정 후 저장, 새로고침 후 유지
4. 토큰 만료 시 자동 리프레시
5. 업로드 페이지에서 5분 MP3 → 멀티 비트레이트 인코딩 → R2 업로드 완료 (1분 이내 목표)
6. 가사 작성 + 음악 생성 요청 → music_generation_requests 레코드 생성
7. 앨범 생성 → 곡과 가사를 앨범에 추가 → 순서 변경
8. 모든 페이지가 디자인 시스템 토큰을 사용 (하드코딩 없음)
9. 한국어 텍스트가 자연스럽게 표시

## 제약과 주의사항

- `CLAUDE.md`의 모든 원칙을 엄격히 준수
- 카카오 access token은 절대 클라이언트 저장 금지, 받은 즉시 Workers에 전달 후 폐기
- `any` 사용 금지, TypeScript strict
- 비밀 값 하드코딩 금지
- 색상/사이즈 하드코딩 금지 (디자인 토큰 경유)
- 새 의존성은 라이선스/유지보수 상태 확인 후 추가
- 작업 중 발견한 세부 절차는 적극적으로 스킬로 분리

## 결과물

작업 끝나면:
- 전체 파일 구조 트리
- 셋업 절차 (Cloudflare 리소스, 카카오 콘솔, 환경 변수)
- 검증 시나리오 실행 순서
- 생성된 스킬 파일 목록과 각 파일의 역할 요약
- Phase 2로 넘어갈 때 이어서 해야 할 작업 정리 (MILESTONES.md Phase 2 참조)

진행하면서 결정이 갈리는 지점이 있으면 합리적 기본값으로 진행하되, 그 선택을 명시해줘. Phase 1이 다 끝나기 전에도 단계별로 동작 가능한 상태(예: 인증까지는 동작, 업로드는 미구현)를 유지하면 검증이 쉬워져.
