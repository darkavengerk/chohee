# 초희 (Chohee)

> 가사가 음악이 되는 공간. AI 음악과 가사를 함께 공유하는 한국어 스트리밍 플랫폼.

[프로젝트 비전과 마일스톤 →](./MILESTONES.md)
[작업 시 규칙과 컨벤션 →](./CLAUDE.md)

## 한 줄 정의

AI로 만든 음악을 공유하는 스트리밍 서비스이자, 사용자가 가사만 올리면 **다른 사용자들이 그 가사에 음악을 입혀 제안**하고 **가사 작성자가 그중 하나를 채택**하는 커뮤니티 기반 공간. 앨범으로 통일성 있는 컨셉도 묶을 수 있다.

세 가지 콘텐츠가 공존한다:

1. **트랙** — 오디오 + 가사가 모두 있는 완성곡
2. **가사** — 텍스트만 있는 1급 콘텐츠. 음악 제안을 받아 채택하면 공식 음원이 된다
3. **앨범** — 트랙과 가사를 묶는 컨테이너

운영자는 음악을 만들지 않는다. 모더레이션과 분쟁 중재만 담당한다.

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프론트엔드 | Next.js 14 App Router · TypeScript · Tailwind CSS |
| 백엔드 | Cloudflare Workers · Hono |
| DB | Cloudflare D1 · Drizzle ORM |
| 스토리지 | Cloudflare R2 (S3 호환) |
| 인증 | 카카오 OAuth + 자체 HS256 JWT (httpOnly 쿠키) |
| 오디오 인코딩 | 클라이언트의 ffmpeg.wasm (128/192/320 kbps AAC) |
| 패키지 매니저 | pnpm + Turborepo |

## 모노레포 구조

```
apps/
  web/      # Next.js 14 사용자 웹
  api/      # Cloudflare Workers + Hono
packages/
  shared/   # 공유 타입, Zod 스키마, 상수
  db/       # Drizzle 스키마, 마이그레이션, D1 클라이언트
  ui/       # 디자인 시스템 토큰, 컴포넌트, Tailwind 프리셋
.claude/
  skills/   # 영역별 상세 절차 — 작업 시 참고
design-ref/ # 디자인 시스템 원본 (HTML 캔버스, jsx 시안)
```

## 빠른 시작

### 1. 의존성 설치

```bash
corepack enable
pnpm install
```

Node 20 이상 권장 (`.nvmrc` 참조).

### 2. Cloudflare 리소스 만들기

D1 + R2 + Workers는 무료 등급으로도 충분히 시작 가능.

```bash
# D1 데이터베이스
wrangler d1 create chohee
# → 출력된 database_id를 apps/api/wrangler.toml의 d1_databases.database_id에 채워넣기

# R2 버킷
wrangler r2 bucket create chohee-media

# R2 S3 호환 자격증명
# Cloudflare 콘솔 → R2 → Manage R2 API Tokens → Object Read & Write 토큰 생성
```

### 3. 카카오 개발자 콘솔 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com)에서 애플리케이션 생성
2. "카카오 로그인" 활성화
3. Redirect URI에 `http://localhost:3000/api/auth/kakao/callback` 등록
4. 동의 항목 설정: 닉네임(필수), 프로필 이미지(선택), 이메일(선택)
5. REST API 키와 Client Secret 복사

### 4. 환경 변수

루트의 `.env.example`을 복사해 값을 채운 뒤 `apps/api`와 `apps/web`에 분배:

```bash
cp .env.example apps/web/.env.local
# apps/web/.env.local에서 NEXT_PUBLIC_* 값들만 채우기

# Workers는 secret으로 등록
cd apps/api
wrangler secret put KAKAO_CLIENT_ID
wrangler secret put KAKAO_CLIENT_SECRET
wrangler secret put JWT_SECRET            # openssl rand -base64 48
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
```

`apps/api/wrangler.toml`의 평문 vars(`WEB_ORIGIN`, `KAKAO_REDIRECT_URI` 등)는 그대로 사용해도 무방. 프로덕션은 `[env.production]` 섹션 참조.

### 5. D1 마이그레이션 적용

```bash
pnpm db:migrate:local      # 로컬 SQLite
pnpm db:migrate:prod       # Cloudflare D1 원격
```

세부 절차는 `.claude/skills/d1-migrations.md`.

### 6. 로컬 실행

```bash
pnpm dev
# → web: http://localhost:3000
# → api: http://localhost:8787
```

## 검증 시나리오 (Phase 1)

1. `pnpm dev`로 web/api 동시 실행
2. http://localhost:3000 → 로그인 → 카카오 인증 → `/me` 진입
3. 프로필 수정 → 저장 → 새로고침 후 유지 확인
4. `/upload/track`에서 5분 MP3 → 멀티 비트레이트 인코딩 → R2 업로드 (1분 이내 목표)
5. `/upload/lyrics`에서 가사 작성 + 음악 제안 받기 옵션 → `music_generation_requests` 레코드 생성 (Phase 1은 의향 발행까지. 다른 사용자의 제안 수집과 채택은 Phase 2.)
6. `/upload/album`에서 앨범 생성 → 곡/가사 항목 추가 → 순서 변경
7. 모든 페이지에 디자인 토큰 일관 적용 (하드코딩 없음)
8. 한국어 텍스트 가독성 (Pretendard 본문, Noto Serif KR 가사) 확인

## 스킬 파일

작업 영역별 세부 절차는 `.claude/skills/`에 분리:

- `design-system.md` — 디자인 토큰과 컴포넌트 사용 가이드
- `kakao-oauth.md` — 카카오 로그인 전체 흐름과 보안
- `jwt-handling.md` — 자체 JWT 발급/검증/회전
- `r2-presigned-urls.md` — R2 직접 업로드 패턴
- `ffmpeg-wasm.md` — 브라우저 인코딩과 LUFS 측정
- `d1-migrations.md` — D1 + Drizzle 마이그레이션

## 다음 단계 (Phase 2)

[MILESTONES.md](./MILESTONES.md)의 Phase 2 섹션을 정본으로:

- 곡/가사/앨범/창작자 상세 페이지
- 글로벌 푸터 플레이어 (페이지 전환 시 재생 유지, MediaSession)
- **커뮤니티 음악 제안 + 채택** — 다른 사용자가 가사에 음악을 입혀 제안, 가사 작성자가 채택. `music_submissions` 테이블과 채택 API 추가.
- 좋아요/팔로우/댓글/알림 (제안 도착/채택 알림 포함)
- 검색 (D1 LIKE → Meilisearch 검토)
- `apps/admin` 운영자 어드민 — **모더레이션 중심** (운영자가 음악을 만들지 않음)

## 라이선스

비공개 프로젝트.
