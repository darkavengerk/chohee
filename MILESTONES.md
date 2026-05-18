# 프로젝트 마일스톤

> AI 음악 공유 플랫폼의 전체 개발 로드맵. 각 마일스톤 작업 시 이 문서를 참고하여 다음 단계와의 연결성을 고려해 설계한다.

## 프로젝트 비전

AI로 만든 음악을 공유하는 스트리밍 플랫폼이자, **가사가 음악이 되는 공간**.

세 가지 콘텐츠 형태가 공존한다:
1. **완성된 곡** (오디오 + 가사)
2. **가사만** — 다른 사람(또는 운영자)이 음악을 붙여줄 수 있는 형태
3. **앨범** — 통일된 컨셉으로 묶인 곡과 가사의 모음

한국 사용자가 주 타겟이지만 글로벌 확장 가능성을 열어둔다. 초기엔 웹 전용으로 시작하고, 콘텐츠 라이브러리가 쌓이면 Flutter 모바일 앱(청취 전용)을 추가한다.

## 핵심 설계 결정

- **업로드/창작은 웹에서만**: 데스크톱 성능과 안정성을 활용. 모바일 앱은 청취/탐색 전용.
- **클라이언트 사이드 인코딩**: 웹 브라우저에서 ffmpeg.wasm으로 음원을 멀티 비트레이트로 변환 후 업로드. 서버 트랜스코딩 인프라 불필요.
- **음악 생성은 수동 처리부터**: 가사 → 음악 변환은 초기엔 운영자가 외부 AI 도구(Suno 등)로 만들어 업로드. 자동화는 후속 단계.
- **Cloudflare 생태계 중심**: Workers + D1 + R2로 비용과 운영 부담 최소화.
- **다중 OAuth 구조**: 카카오 우선, Apple/Google 확장 가능한 스키마.
- **디자인 시스템 처음부터 적용**: 별도 디자인 작업물의 토큰과 컴포넌트를 Phase 1부터 사용. 나중에 재작업하지 않는다.

## 기술 스택

- **프론트엔드**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **백엔드**: Cloudflare Workers + Hono
- **DB**: Cloudflare D1 + Drizzle ORM
- **스토리지**: Cloudflare R2 (음원, 커버 아트, 파형 데이터)
- **인증**: 카카오 OAuth (초기), Apple/Google 확장 예정
- **음원 처리**: 클라이언트에서 ffmpeg.wasm
- **패키지 매니저**: pnpm + Turborepo

## 모노레포 구조

```
apps/
  web/          # Next.js 프론트엔드
  api/          # Cloudflare Workers + Hono
  admin/        # Phase 2부터 운영자 어드민
packages/
  shared/       # 공유 타입, 상수, 유틸
  db/           # Drizzle 스키마와 마이그레이션
  ui/           # 디자인 시스템 토큰과 공통 컴포넌트
```

---

## Phase 1: 기반 + 콘텐츠 생성

**목표**: 사용자가 가입/로그인하고, 웹에서 곡/가사/앨범을 올릴 수 있다. 디자인 시스템이 처음부터 적용된다.

### 범위

**인증과 사용자 관리**
- 모노레포 셋업 (Turborepo, pnpm workspaces)
- 카카오 OAuth + 자체 JWT (access 1h, refresh 30d, httpOnly 쿠키)
- 다중 OAuth 확장 가능한 스키마 (users, auth_providers, refresh_tokens)
- 보호된 라우트 미들웨어
- 프로필 페이지와 수정 기능

**디자인 시스템 통합**
- 별도 디자인 작업물의 토큰(색상, 타이포, 간격, 모서리, 그림자, 모션)을 `packages/ui`로 통합
- Tailwind config에 토큰 매핑
- 폰트 로딩 (Pretendard 등)
- 공통 컴포넌트(버튼, 입력, 카드, 폼, 토스트 등)를 디자인 시스템 기준으로 구현
- 다크 모드 일관성 확인
- 모든 페이지가 디자인 토큰을 사용 (하드코딩된 색/사이즈 금지)

**콘텐츠 도메인 모델**
- D1 스키마
  - users, auth_providers, refresh_tokens
  - tracks (id, user_id, album_id nullable, lyrics_id nullable, title, audio_key_prefix, waveform_key, duration_ms, loudness_lufs, status, generated_by, created_at, ...)
  - lyrics (id, user_id, album_id nullable, title, text, language, mood_tags, generation_request_status, is_public, created_at, ...)
  - albums (id, user_id, title, concept_description, mood_tags, cover_art_key, status, created_at, ...)
  - album_items (album_id, item_type, item_id, position)
  - music_generation_requests (id, lyrics_id, requested_by_user_id, status, preferences_json, assigned_to_admin_id, result_track_id, requested_at, completed_at, notes)
- Drizzle 스키마와 마이그레이션

**Workers API**
- 인증: /auth/kakao, /auth/refresh, /auth/logout, /me, PATCH /me
- 트랙: CRUD `/tracks`, `/tracks/:id`
- 가사: CRUD `/lyrics`, `/lyrics/:id`
- 앨범: CRUD `/albums`, `/albums/:id`, 아이템 추가/순서 변경
- 음악 생성 요청: POST `/lyrics/:id/request-music`, GET `/me/generation-requests`
- R2 업로드용 서명된 URL 발급: `POST /uploads/sign`
- 권한 검증 (작성자만 자기 콘텐츠 수정/삭제)

**웹 업로드 흐름**
- 업로드 진입 페이지 ("무엇을 올릴까요?" — 곡 / 가사 / 앨범)
- 곡 업로드
  - 파일 드래그앤드롭
  - ffmpeg.wasm 통합 (Web Worker, lazy load)
  - 멀티 비트레이트 인코딩 (128, 192, 320 kbps AAC)
  - Web Audio API로 파형 + LUFS 측정
  - 메타데이터 폼 (제목, 설명, 가사 연결, 앨범 연결, 커버 아트)
  - R2 직접 업로드 (서명된 URL, 재개 가능)
- 가사 업로드
  - 가사 에디터
  - 음악 생성 요청 옵션 (장르 힌트, 무드)
- 앨범 생성
  - 컨셉 메타데이터
  - 곡/가사 묶기와 순서 관리

**개발 환경**
- Wrangler로 Workers 로컬 개발
- 환경 변수 관리 (`.env.example` 커밋)
- 루트 `pnpm dev`로 web/api 동시 실행

### 검증 기준

- 카카오 로그인 → 사용자 생성 → 프로필 수정 흐름 동작
- 5분짜리 MP3 파일을 데스크톱 브라우저에서 멀티 비트레이트로 인코딩 후 R2 업로드 완료 (1분 이내 목표)
- 파형 데이터와 LUFS가 R2에 저장
- 가사만 올려도 generation_request 생성됨
- 앨범에 곡과 가사 모두 추가 가능, 순서 변경 동작
- 모든 페이지에 디자인 시스템 토큰 일관 적용
- 한국어 텍스트 가독성 확보

### 기술 메모

- ffmpeg.wasm: SharedArrayBuffer 필요 → COOP/COEP 헤더 설정 (Next.js config)
- 매우 긴 곡(15분+)은 메모리 주의 — 청크 처리 검토
- R2 객체 키 구조: `tracks/{user_id}/{track_id}/{bitrate}.m4a`, `tracks/{user_id}/{track_id}/waveform.json`
- 자주 변하는 세부 사항(인코딩 상세, R2 키 구조, 카카오 OAuth 자세한 흐름)은 스킬로 분리

---

## Phase 2: 소비 + 운영

**목표**: 청취자가 콘텐츠를 발견하고 즐길 수 있고, 운영자가 음악 생성 요청을 처리할 수 있다.

### 범위

**콘텐츠 페이지**
- 곡 상세 페이지
  - 큰 커버 아트, 메타데이터, 설명
  - 가사 표시 영역 (1급 시민, 타이포그래피 신중하게)
  - 파형 플레이어 (재생/일시정지/시킹/시간)
  - 같은 앨범/같은 작가의 다른 곡
- 가사 상세 페이지 (음악 없는 가사)
  - 가사 텍스트가 메인 콘텐츠
  - "이 가사에 어울리는 음악 만들어주세요" CTA
  - 진행 상태 표시 (대기/생성 중/완료)
- 앨범 페이지
  - 컨셉/무드 정보
  - 수록 곡과 가사를 함께 표시
  - 앨범 전체 재생
- 창작자 프로필 페이지
  - 프로필 정보
  - 탭: 곡, 가사, 앨범
- 홈/탐색
  - 최신 곡, 새 가사, 새 앨범, 추천
  - 콘텐츠 타입 필터

**재생 인프라**
- HTML5 Audio + Web Audio API 조합
- R2 스트리밍용 서명된 URL 발급 (`GET /tracks/:id/stream-url`)
- 글로벌 푸터 플레이어 (페이지 이동 시에도 재생 유지, Zustand 또는 Context)
- MediaSession API로 모바일 브라우저 락스크린 컨트롤
- Range Request 자동 동작 확인

**소셜 기능**
- 좋아요 (트랙/가사/앨범)
- 팔로우 (창작자)
- 댓글 (트랙/가사/앨범)
- 알림
  - 인앱 알림 (좋아요/팔로우/댓글/음악 생성 완료)
  - 이메일 또는 카카오 알림톡 (선택)

**검색**
- 처음엔 D1 LIKE 쿼리로 시작 (제목, 작가명, 태그)
- 한국어 검색 품질이 부족하면 Meilisearch 도입 검토

**운영자 어드민** (`apps/admin`)
- 별도 Next.js 앱으로 분리
- 관리자 권한 미들웨어
- 음악 생성 요청 큐
- 요청 처리 인터페이스 (외부 도구로 생성한 트랙을 업로드해서 가사와 연결)
- 콘텐츠 신고/모더레이션 (기본 수준)

**알림 시스템**
- 음악 생성 완료 시 사용자에게 알림
- 좋아요/팔로우/댓글 시 알림
- 알림 설정 페이지

### 검증 기준

- 페이지를 오가며 재생이 끊기지 않음
- 곡 시킹, 시간 표시, 일시정지 정상 동작
- 어드민에서 가사 → 곡 연결까지 전 흐름 동작 (외부 도구 사용 가정)
- 한국어 곡명/가사 검색이 합리적으로 동작
- 알림이 적절한 지연 시간 내 전달

### 기술 메모

- 대량 재생 이벤트는 D1이 아닌 Cloudflare Analytics Engine으로 전송
- 푸터 플레이어 상태 관리 패턴, 페이지 전환 시 재생 유지 방법은 스킬로 분리
- 어드민과 메인 앱은 같은 API를 쓰되, 어드민 권한 검증 미들웨어 별도

---

## Phase 3: 크리에이터 도구 + 확장

**목표**: 창작자가 성과를 분석하고 콘텐츠를 효율적으로 관리할 수 있다. 모바일과 글로벌 확장의 기반을 마련한다.

### 범위

**크리에이터 대시보드**
- 본인 콘텐츠 통합 관리 (곡/가사/앨범)
- 상태별 필터 (공개/비공개/생성 대기/생성 중)
- 일괄 작업 (공개/비공개 토글, 앨범 이동, 삭제)
- 음악 생성 요청 추적 페이지 (사용자용)

**통계 분석**
- 재생 수, 좋아요 수, 팔로워 추이
- 곡별/일별 그래프
- 청취자 지역, 시간대 분포
- Cloudflare Analytics Engine 데이터 활용

**자동화/확장**
- 음악 생성 자동화 옵션 (외부 AI API 통합, 수동 처리와 공존)
- Apple/Google OAuth 추가
- 다국어 UI 기반 마련 (i18n 키 구조)

**모바일 앱 준비** (선택, 다음 페이즈로 미뤄도 됨)
- Flutter 앱 셋업 (`apps/mobile`)
- 청취/탐색/소셜 (업로드 없음)
- just_audio + audio_service
- 카카오 + Apple 로그인
- 오프라인 다운로드 (선택)

**수익화/콘텐츠 관리**
- 구독, 후원, 곡 판매 중 선택 구현
- 콘텐츠 모더레이션 자동화 (저작권 핑거프린팅, AI 부적절 콘텐츠 검출)
- DMCA 신고 워크플로

### 검증 기준

- 100개 이상 트랙 보유 사용자가 대시보드에서 끊김 없이 관리
- 통계가 합리적 지연 시간으로 업데이트
- (모바일을 포함했다면) iOS/Android에서 재생/탐색/소셜 흐름 동작

### 기술 메모

- Analytics Engine 쿼리 패턴, BigQuery 또는 ClickHouse로의 ETL 검토 시점
- 자동화 처리기는 같은 인터페이스(`music_generation_requests`)에 다른 백엔드를 붙이는 식으로 확장
- 모바일은 별도 앱으로 시작, API는 그대로 재사용

---

## 운영 원칙

- 각 Phase는 검증 기준을 충족해야 다음으로 넘어간다.
- 각 Phase 종료 시 이 문서와 `CLAUDE.md`를 업데이트한다.
- 작업 중 반복적으로 참조되는 세세한 절차/규칙은 스킬로 분리한다 (`CLAUDE.md` 참조).
- 데이터베이스 변경은 항상 마이그레이션 파일을 만들어 적용한다.
- 새 의존성을 추가할 땐 라이선스와 유지보수 상태를 확인한다.
- 비용 모니터링: Cloudflare 대시보드 주기 확인.
