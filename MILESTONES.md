# 프로젝트 마일스톤

> AI 음악 공유 플랫폼의 전체 개발 로드맵. 각 마일스톤 작업 시 이 문서를 참고하여 다음 단계와의 연결성을 고려해 설계한다.

## 프로젝트 비전

AI로 만든 음악을 공유하는 스트리밍 플랫폼이자, **가사가 음악이 되는 공간**.

세 가지 콘텐츠 형태가 공존한다:
1. **완성된 곡** (오디오 + 가사)
2. **가사만** — 다른 사용자들이 음악을 입혀 제안할 수 있는 형태. 가사 작성자는 여러 후보 중 하나를 채택해 공식 음원으로 지정한다.
3. **앨범** — 통일된 컨셉으로 묶인 곡과 가사의 모음

음악 생성은 **커뮤니티 기반**이다. 운영자가 음악을 만들지 않고, 다른 사용자들이 가사에 음악을 입혀 제안하면 작성자가 채택한다. 운영자는 모더레이션과 분쟁 중재만 담당한다.

한국 사용자가 주 타겟이지만 글로벌 확장 가능성을 열어둔다. 초기엔 웹 전용으로 시작하고, 콘텐츠 라이브러리가 쌓이면 Flutter 모바일 앱(청취 전용)을 추가한다.

## 핵심 설계 결정

- **업로드/창작은 웹에서만**: 데스크톱 성능과 안정성을 활용. 모바일 앱은 청취/탐색 전용.
- **클라이언트 사이드 인코딩**: 웹 브라우저에서 ffmpeg.wasm으로 음원을 멀티 비트레이트로 변환 후 업로드. 서버 트랜스코딩 인프라 불필요.
- **음악 생성은 커뮤니티 기반**: 가사 → 음악 변환은 다른 사용자들이 외부 AI 도구(Suno 등) 또는 직접 작곡으로 후보를 제안하고, 가사 작성자가 그중 하나를 채택한다. 운영자는 음악을 만들지 않고 모더레이션만 담당한다. AI 자동 제안은 후속 Phase에서 동일한 제안 인터페이스에 처리기를 붙여 확장.
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
    - Phase 1에선 "가사 작성자가 음악 후보를 받고 싶다"는 의향만 표현. 후보 제안과 채택 구조는 Phase 2에서 `music_submissions` + `lyrics.adopted_track_id`로 추가. `assigned_to_admin_id`와 `result_track_id` 필드는 Phase 1 시점 호환용으로 유지하되 Phase 2에서 의미가 재정의되거나 deprecate 될 수 있다 — **운영자가 결과 트랙을 직접 만들지 않는다**.
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
- 가사만 올려도 generation_request 생성됨 (Phase 1에선 "음악 받고 싶다" 의향 발행까지)
- 앨범에 곡과 가사 모두 추가 가능, 순서 변경 동작
- 모든 페이지에 디자인 시스템 토큰 일관 적용
- 한국어 텍스트 가독성 확보

### 기술 메모

- ffmpeg.wasm: SharedArrayBuffer 필요 → COOP/COEP 헤더 설정 (Next.js config)
- 매우 긴 곡(15분+)은 메모리 주의 — 청크 처리 검토
- R2 객체 키 구조: `tracks/{user_id}/{track_id}/{bitrate}.m4a`, `tracks/{user_id}/{track_id}/waveform.json`
- 자주 변하는 세부 사항(인코딩 상세, R2 키 구조, 카카오 OAuth 자세한 흐름)은 스킬로 분리

---

## Phase 2: 소비 + 커뮤니티 음악 제안

**목표**: 청취자가 콘텐츠를 발견하고 즐길 수 있고, **다른 사용자들이 가사에 음악을 입혀 제안하면 가사 작성자가 채택**할 수 있다. 운영자는 모더레이션을 담당한다.

### 범위

**콘텐츠 페이지**
- 곡 상세 페이지
  - 큰 커버 아트, 메타데이터, 설명
  - 가사 표시 영역 (1급 시민, 타이포그래피 신중하게)
  - 파형 플레이어 (재생/일시정지/시킹/시간)
  - 가사가 연결된 트랙이면 "이 곡은 「가사 제목」의 채택된 음원입니다" 컨텍스트와 작성자/제안자 크레딧
  - 같은 앨범/같은 작가의 다른 곡
- 가사 상세 페이지 (음악 없는 가사 또는 제안 모집 중인 가사)
  - 가사 텍스트가 메인 콘텐츠
  - **"이 가사에 음악 제안하기" CTA** — 누구나 진입 가능 (가사 작성자 본인 제외 옵션 검토)
  - **후보 트랙 섹션**: 제출된 제안들을 파형 미니 플레이어로 나열. 제안자, 제안 일시, 짧은 메모.
  - 채택된 트랙이 있으면 최상단에 강조 + "다른 후보도 들어보기" 토글
  - 가사 작성자에게만 보이는 "채택" 버튼 (후보별)
  - 진행 상태: open(제안 받는 중) / adopted(채택됨) / closed(가사 작성자가 닫음)
- 앨범 페이지
  - 컨셉/무드 정보
  - 수록 곡과 가사를 함께 표시
  - 앨범 전체 재생
- 창작자 프로필 페이지
  - 프로필 정보
  - 탭: 곡, 가사, 앨범, **음악 제안 활동** (이 사람이 다른 가사에 제안한 곡들)
- 홈/탐색
  - 최신 곡, 새 가사, 새 앨범, 추천
  - **"음악을 기다리는 가사" 피드** — open 상태의 가사를 무드/장르/언어 필터와 함께 노출
  - 콘텐츠 타입 필터

**재생 인프라**
- HTML5 Audio + Web Audio API 조합
- R2 스트리밍용 서명된 URL 발급 (`GET /tracks/:id/stream-url`)
- 글로벌 푸터 플레이어 (페이지 이동 시에도 재생 유지, Zustand 또는 Context)
- MediaSession API로 모바일 브라우저 락스크린 컨트롤
- Range Request 자동 동작 확인

**커뮤니티 음악 제안 + 채택**
- 신규 DB 스키마 (마이그레이션)
  - `music_submissions` (id, request_id, lyrics_id, submitter_user_id, track_id, message, status: submitted|withdrawn|adopted|rejected, submitted_at, decided_at)
  - `lyrics.adopted_track_id` 추가 (또는 채택은 `music_submissions.status='adopted'` + lyrics에 view로 노출)
  - `music_generation_requests.status` 값 재정의: `open` | `adopted` | `closed` | `flagged`
- API
  - POST `/lyrics/:id/submissions` — 누구나(인증 사용자) 자기 트랙을 후보로 제출. 가사 작성자 본인 제외 정책 검토.
  - GET `/lyrics/:id/submissions` — 후보 목록 (공개)
  - PATCH `/submissions/:id/withdraw` — 제안자가 직접 철회
  - POST `/lyrics/:id/adopt/:submissionId` — 가사 작성자만 호출 가능. 채택 시 `music_generation_requests`도 `adopted`로 전환, lyrics와 트랙 연결 갱신.
  - POST `/lyrics/:id/close-requests` — 가사 작성자가 후보 모집을 종료
- 웹 UI
  - 가사 상세 페이지의 제안 섹션
  - "내 가사 → 받은 제안" 대시보드 (가사 작성자용)
  - "내가 제안한 곡들" 페이지 (제안자 추적용, 채택/철회/대기 상태 표시)
  - 음악 제안 흐름: 가사 페이지의 "음악 제안하기" → 기존 곡 업로드 흐름 재사용 (+ 가사 자동 연결, 제안 메모 입력)
- 정책
  - 가사 작성자는 언제든 후보 모집을 닫을 수 있다 (이미 제출된 후보는 트랙으로 그대로 남되, 가사와의 연결은 끊기거나 유지 — 결정 필요)
  - 채택은 1회. 채택 후 변경하려면 새 요청 발행
  - 제안 트랙은 채택 여부와 무관하게 제안자의 개인 카탈로그에 남는다 (다른 가사에 재사용 불가, 별도 트랙은 가능)
  - 부적절한 제안은 가사 작성자가 "신고" 또는 운영자가 "감추기" 가능

**소셜 기능**
- 좋아요 (트랙/가사/앨범/제안)
- 팔로우 (창작자)
- 댓글 (트랙/가사/앨범)
- 알림
  - 인앱 알림
    - 좋아요/팔로우/댓글
    - 새 음악 제안 도착 (가사 작성자에게)
    - 내 제안이 채택됨/거절됨 (제안자에게)
    - 가사 작성자가 후보 모집을 닫음 (대기 중인 제안자에게)
  - 이메일 또는 카카오 알림톡 (선택)

**검색**
- 처음엔 D1 LIKE 쿼리로 시작 (제목, 작가명, 태그)
- 한국어 검색 품질이 부족하면 Meilisearch 도입 검토

**운영자 어드민** (`apps/admin`) — 모더레이션 중심
- 별도 Next.js 앱으로 분리
- 관리자 권한 미들웨어
- **운영자는 음악을 만들지 않는다.** 어드민의 역할:
  - 신고된 콘텐츠(곡/가사/앨범/제안/댓글) 검토 및 처리 (감추기/삭제/계정 제재)
  - 부적절한 음악 제안의 일괄 감추기 (가사 작성자가 직면하기 전 사전 차단)
  - 저작권 분쟁 중재 (Phase 3의 핑거프린팅 자동화 전까지 수동 처리)
  - "open 가사" 모니터링 — 장기간 제안 없이 방치된 가사에 대한 운영적 액션 검토 (예: 추천 피드 배치)
  - 신규 사용자 환영, 어뷰징 패턴 감지
- 음악 생성 요청 큐 → **모더레이션 큐**로 의미 재정의 (Phase 1의 `assigned_to_admin_id`는 모더레이션 담당자 표시로 활용 가능)

**알림 시스템**
- 음악 제안 도착/채택/거절 시 양쪽에게 알림
- 좋아요/팔로우/댓글 시 알림
- 모더레이션 결정 시 당사자에게 알림
- 알림 설정 페이지

### 검증 기준

- 페이지를 오가며 재생이 끊기지 않음
- 곡 시킹, 시간 표시, 일시정지 정상 동작
- **가사 → 다른 사용자가 음악 제안 → 가사 작성자가 채택** 전 흐름 동작 (외부 AI 도구로 만든 음원 사용 가정)
- 한 가사에 여러 후보가 공존하고, 후보 간 비교 청취가 가능
- 어드민에서 신고 검토/감추기 흐름 동작
- 한국어 곡명/가사 검색이 합리적으로 동작
- 알림(제안 도착/채택)이 적절한 지연 시간 내 전달

### 기술 메모

- 대량 재생 이벤트는 D1이 아닌 Cloudflare Analytics Engine으로 전송
- 푸터 플레이어 상태 관리 패턴, 페이지 전환 시 재생 유지 방법은 스킬로 분리
- 어드민과 메인 앱은 같은 API를 쓰되, 어드민 권한 검증 미들웨어 별도
- 음악 제안 흐름은 기존 곡 업로드 흐름 재사용 — 트랙 생성 시 `lyrics_id` + "제안임" 플래그를 함께 보내면 `music_submissions` 레코드가 자동 생성되도록 API 설계. 이로써 클라이언트 코드 중복 최소화.
- 제안/채택 정책의 디테일(자기 가사에 자기 제안 가능 여부, 채택 후 후보들 처리, 가사 비공개 전환 시 후보들의 운명)은 별도 정책 문서로 분리해 운영 중 조정 가능하게 유지

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
- **AI 자동 제안 옵션**: 가사 작성자가 자기 가사에 한해 외부 AI API(Suno 등)로 즉시 후보 트랙을 생성. 결과는 `music_submissions`에 `submitter=AI`로 등록되어 커뮤니티 제안과 동일한 채택 흐름을 거친다. 사람 제안과 AI 제안이 한 가사 안에서 공존.
- 자동 제안의 토큰/비용 한도, 남용 방지 (rate limit, 일일 한도)
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
- AI 자동 제안 처리기는 Phase 2에서 만든 `music_submissions` 인터페이스에 새 submitter 종류(AI 봇 계정 또는 별도 플래그)를 붙이는 식으로 확장. 사람 제안 흐름과 동일한 채택/거절을 거친다.
- 모바일은 별도 앱으로 시작, API는 그대로 재사용

---

## 운영 원칙

- 각 Phase는 검증 기준을 충족해야 다음으로 넘어간다.
- 각 Phase 종료 시 이 문서와 `CLAUDE.md`를 업데이트한다.
- 작업 중 반복적으로 참조되는 세세한 절차/규칙은 스킬로 분리한다 (`CLAUDE.md` 참조).
- 데이터베이스 변경은 항상 마이그레이션 파일을 만들어 적용한다.
- 새 의존성을 추가할 땐 라이선스와 유지보수 상태를 확인한다.
- 비용 모니터링: Cloudflare 대시보드 주기 확인.
