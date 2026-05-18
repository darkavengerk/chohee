# 초희 (Chohee) — 디자인 시스템

> 가사가 음악이 되는 공간. 창작자와 작품을 존중하는 따뜻한 다크 모드.

---

## 0. 디자인 컨셉

**한 줄 정의.** AI로 만든 음악과 가사를 공유하는 한국어 스트리밍 플랫폼. 가사를 음악의 부속물이 아닌 독립된 작품으로 다루며, "디지털이지만 손으로 만든 것 같은" 따뜻한 다크 톤을 유지한다.

**세 가지 출발점.**

1. **가사는 1급 콘텐츠.** 가사를 시집의 호흡으로 다룬다. 한글 명조(Noto Serif KR), 1.95 행간, +0.01em 자간, `word-break: keep-all`. 음악이 없는 가사 페이지에도 별도 화면이 존재한다.
2. **디지털이지만 손으로 만든.** 순검정·순백·차가운 그라디언트·네온 액센트를 모두 피한다. 따뜻한 차콜(약한 갈색 기운) 위에 크림빛 오프화이트, 절제된 머스타드/앰버 한 가지만 액센트로 사용. 표면에 약한 그레인 텍스처.
3. **공존하는 창작 단계.** 완성된 곡, 음악을 기다리는 가사, 한 호흡으로 묶인 앨범이 한 화면에 자연스럽게 공존한다. 상태 배지는 신호등이 아니라 작품의 단계를 안내하는 표식.

**무엇을 피했나.** AI/테크 서비스의 보라-파랑 그라디언트, 네온 액센트, 과한 이모지, 차가운 시스템 폰트, 너무 둥근 모서리, 강한 그림자, 빠르고 튀는 모션.

---

## 1. 컬러 토큰

모든 색은 `oklch()`로 정의해 한 축(hue/chroma)을 흔들면 시스템 전체가 따라 움직인다. hex 값은 근사치(참고용).

### 1.1 표면 (Surfaces) — 5단계 따뜻한 차콜

| 토큰     | hex(approx) | oklch                  | 사용처              |
| -------- | ----------- | ---------------------- | ------------------- |
| `--bg-0` | `#1a1816`   | `oklch(0.155 0.008 60)` | 페이지 배경 (가장 깊음) |
| `--bg-1` | `#21201d`   | `oklch(0.185 0.008 60)` | 카드 · 섹션 표면       |
| `--bg-2` | `#272623`   | `oklch(0.22 0.008 60)`  | 모달 · hover         |
| `--bg-3` | `#2f2d2a`   | `oklch(0.27 0.008 60)`  | 입력 · 칩            |
| `--bg-4` | `#3a3835`   | `oklch(0.32 0.008 60)`  | 강한 디바이더         |

### 1.2 텍스트 (Foreground) — 4단계 크림빛

| 토큰     | hex(approx) | oklch                  | 사용처               |
| -------- | ----------- | ---------------------- | -------------------- |
| `--fg-1` | `#f5f1e8`   | `oklch(0.96 0.012 85)`  | 본문 · 강조 텍스트     |
| `--fg-2` | `#c8c2b3`   | `oklch(0.82 0.012 80)`  | 보조 본문            |
| `--fg-3` | `#9c958a`   | `oklch(0.65 0.01 75)`   | 메타데이터 · placeholder |
| `--fg-4` | `#736e66`   | `oklch(0.48 0.008 70)`  | 비활성 · 행번호       |

### 1.3 경계 (Borders)

| 토큰     | hex(approx) | 사용처                 |
| -------- | ----------- | ---------------------- |
| `--bd-1` | `#322f2c`   | 카드 · 입력 기본 경계   |
| `--bd-2` | `#433f3a`   | 강조 경계 · 비활성 버튼  |

### 1.4 액센트 — 따뜻한 톤 1가지 (최종: **mustard**)

기본은 mustard. 시즌 운영용으로 4종을 정의하되 한 번에 하나만 활성화. **차가운 색은 시맨틱(상태) 용도로만.**

| 이름        | oklch                  | hex(approx) | 비고              |
| ----------- | ---------------------- | ----------- | ----------------- |
| **mustard** ★ | `oklch(0.82 0.14 92)`  | `#dac257`   | **메인 액센트**     |
| amber       | `oklch(0.78 0.14 70)`  | `#d4a356`   | 가을 운영용        |
| terracotta  | `oklch(0.66 0.13 38)`  | `#bf6f48`   | 작품 강조 보조     |
| coral       | `oklch(0.74 0.15 28)`  | `#e08866`   | 겨울 운영용        |

파생 토큰:
- `--accent` · 메인 액센트
- `--accent-soft` · 14% 알파 — 배경 강조용
- `--accent-fg` · 액센트 위 텍스트 (어두운 차콜)
- `--accent-2` · 보조 액센트 (예: terracotta)

### 1.5 시맨틱 (차가운 톤 허용)

| 토큰        | oklch                  | hex(approx) | 사용처     |
| ----------- | ---------------------- | ----------- | ---------- |
| `--info`    | `oklch(0.72 0.07 230)` | `#7da4c2`   | 안내       |
| `--success` | `oklch(0.72 0.1 150)`  | `#7fb89a`   | 완료 · 성공 |
| `--warn`    | `oklch(0.8  0.13 80)`  | `#d6b966`   | 주의       |
| `--danger`  | `oklch(0.66 0.16 25)`  | `#cf6855`   | 삭제 · 오류 |

### 1.6 음악 생성 상태 (Status)

| 상태          | 토큰              | 배지 라벨        | 시각 동작                  |
| ------------- | ----------------- | ---------------- | -------------------------- |
| `waiting`     | `--st-waiting`    | "음악 대기 중"    | 중성 회색, 정적            |
| `generating`  | `--st-progress`   | "생성 중"        | 머스타드, **펄스 도트**     |
| `complete`    | `--st-complete`   | "완성"           | 세이지, 정적               |
| `revision`    | `--st-revision`   | "보완 요청"      | 테라코타, 정적 도트         |

---

## 2. 타이포그래피

### 2.1 패밀리

| 토큰          | 폴백 체인                                                                                | 역할                          |
| ------------- | ---------------------------------------------------------------------------------------- | ----------------------------- |
| `--font-sans` | `"Pretendard Variable", -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif` | UI · 본문 · 메타데이터          |
| `--font-serif`| `"Noto Serif KR", "Nanum Myeongjo", "본명조", "Source Serif 4", serif`                    | 가사 · 디스플레이 · 작품 텍스트  |
| `--font-mono` | `"JetBrains Mono", "SF Mono", ui-monospace, monospace`                                    | 시간 · ID · 통계 숫자          |

### 2.2 스케일

| 토큰          | 사이즈/lh    | 패밀리 | 용례                |
| ------------- | ----------- | ------ | ------------------- |
| `display-xl`  | 64–88 / 1.05 | serif  | 가사 페이지 제목     |
| `display`     | 48–56 / 1.1  | serif  | 페이지 hero 제목     |
| `title`       | 32–40 / 1.2  | serif  | 화면 제목           |
| `subtitle`    | 22–26 / 1.35 | serif  | 카드 제목 · 섹션 헤더 |
| `body-lg`     | 16 / 1.7     | sans   | 본문 강조           |
| `body`        | 14 / 1.55    | sans   | 일반 본문           |
| `caption`     | 12 / 1.4     | sans   | 메타데이터          |
| `mono`        | 10.5–12 / 1.4 | mono  | 시간 · ID · 수치     |

자간 규칙: serif는 `+0.005em`, sans는 `-0.005em`, mono는 0.

### 2.3 가사 표시 가이드 (Lyrics)

**가사는 단순한 텍스트가 아니라 작품이다.** 모든 가사 렌더링은 다음 규칙을 따른다.

```css
.lyrics {
  font-family: var(--font-serif);   /* Noto Serif KR */
  font-weight: 400;
  font-size: 22px;                  /* base */
  line-height: 1.95;                /* 시집의 행간 */
  letter-spacing: 0.01em;           /* 한글 자간 살짝 벌림 */
  color: var(--fg-1);
  white-space: pre-wrap;            /* 작가의 줄바꿈 보존 */
  word-break: keep-all;             /* 한글 단어 잘림 방지 */
  text-wrap: pretty;
}
.lyrics--lg { font-size: 28px; line-height: 2.05; }
.lyrics--xl { font-size: 36px; line-height: 2.0; letter-spacing: 0.012em; }
.lyrics .stanza + .stanza { margin-top: 1.4em; }  /* 연 사이 호흡 */
```

**스케일 사용처.**
- `lyrics` (22px) — 곡 상세 · 카드 미리보기
- `lyrics--lg` (28px) — 앨범 페이지 · feature 영역
- `lyrics--xl` (36px) — 가사 전용 페이지 (시집 메타포)

**금지.** 가사를 `text-align: center`로 강제하지 말 것 (작가가 의도한 경우 외엔 좌측 정렬), 자동 줄바꿈 금지, 후렴 강조는 `color: var(--accent)` 또는 `font-style: italic`로만.

---

## 3. 간격 (Spacing)

**4px 베이스.** 모든 패딩/마진은 아래 토큰을 따른다.

| 토큰     | 값    | 용례                  |
| -------- | ----- | --------------------- |
| `--s-1`  | 4px   | 아이콘-텍스트 gap     |
| `--s-2`  | 8px   | 칩 내부 · 버튼 gap    |
| `--s-3`  | 12px  | 카드 내부 작은 그룹   |
| `--s-4`  | 16px  | 카드 내부 표준 gap    |
| `--s-5`  | 20px  | 입력 그룹             |
| `--s-6`  | 24px  | 섹션 내부             |
| `--s-8`  | 32px  | 카드 패딩 · 섹션 간   |
| `--s-10` | 40px  | 페이지 좌우 패딩       |
| `--s-12` | 48px  | 큰 섹션 간            |
| `--s-16` | 64px  | hero 패딩             |
| `--s-20` | 80px  | 페이지 상하 마진       |
| `--s-24` | 96px  | 화면 간 큰 호흡        |

## 4. 모서리 (Radius)

**부드럽지만 너무 둥글지 않게** — 테크 느낌 회피.

| 토큰       | 값    | 용례                       |
| ---------- | ----- | -------------------------- |
| `--r-xs`   | 4px   | 칩 내부 액센트 · 코드 인라인 |
| `--r-sm`   | 6px   | 작은 칩 · 텍스트 강조 영역  |
| `--r-md`   | 10px  | 버튼 · 입력 · 메뉴 아이템    |
| `--r-lg`   | 14px  | 카드 · 모달                |
| `--r-xl`   | 20px  | hero · 큰 컨테이너          |
| `--r-pill` | 999px | 칩 · 배지 · 팔로우 버튼     |

## 5. 그림자 (Shadow)

다크 위에서는 그림자를 약하게. 깊이감은 표면 단계(`--bg-1` → `--bg-4`)가 만든다.

| 토큰      | 값                                                                       | 용례        |
| --------- | ------------------------------------------------------------------------ | ----------- |
| `--sh-1`  | `0 1px 0 oklch(1 0 0 / 0.04) inset, 0 1px 2px oklch(0 0 0 / 0.25)`        | 카드        |
| `--sh-2`  | `0 1px 0 oklch(1 0 0 / 0.04) inset, 0 4px 12px oklch(0 0 0 / 0.32)`       | hover · 모달 |
| `--sh-3`  | `0 1px 0 oklch(1 0 0 / 0.05) inset, 0 12px 32px oklch(0 0 0 / 0.42)`      | popover · 풋플레이어 |

## 6. 모션 (Motion)

**차분하게, 빠르고 튀는 애니메이션 지양.**

| 토큰        | 값                                  | 용례                       |
| ----------- | ----------------------------------- | -------------------------- |
| `--t-fast`  | `120ms`                             | hover · focus · 버튼 press |
| `--t-base`  | `200ms`                             | 카드 hover · 탭 전환        |
| `--t-slow`  | `360ms`                             | 패널 open · progress fill   |
| `--t-page`  | `480ms`                             | 페이지 전환 · skeleton fade |
| `--ease`    | `cubic-bezier(0.2, 0.7, 0.3, 1)`    | 기본 곡선                  |
| `--ease-out`| `cubic-bezier(0.16, 1, 0.3, 1)`     | 등장 애니메이션            |

**전용 키프레임.**
- `chohee-pulse` (1.8s ease infinite) — 생성 중 상태 도트
- `chohee-wave` (0.9s ease infinite) — 파형 재생 바

---

## 7. 컴포넌트 가이드

### 7.1 Button

| 변형        | 배경                  | 텍스트            | 사용처              |
| ----------- | --------------------- | ----------------- | ------------------- |
| `primary`   | `--accent`            | `--accent-fg`     | 주요 CTA            |
| `secondary` | `--bg-2`              | `--fg-1`          | 페이지 내 보조 액션  |
| `outline`   | `transparent` + 경계  | `--fg-1`          | 부드러운 액션       |
| `ghost`     | `transparent`         | `--fg-2`          | 텍스트 링크 대체    |
| `danger`    | `transparent` + 빨간경계 | `--danger`     | 삭제 · 위험         |

**사이즈.** `sm` 28px / `md` 36px / `lg` 44px. 모바일 hit target은 44px 이상.

### 7.2 Status Badge (음악 생성 상태)

`<StatusBadge status="waiting|generating|complete|revision">`.
- `generating`은 좌측에 펄스 도트 (`chohee-pulse`).
- 배지 형태: pill, 색상 12% 알파 배경 + 22% 알파 경계.
- 한 화면에 여러 상태가 공존할 수 있음 (앨범 페이지 트랙리스트).

### 7.3 Chip (장르 · 무드 · 태그)

- 기본: `--bg-2` + `--bd-1`
- active: `--accent-soft` + accent 경계
- pill 모양, 사이즈 `sm/md/lg`
- 아이콘 prefix 가능

### 7.4 Card

| 종류       | 구성                                                  |
| ---------- | ----------------------------------------------------- |
| `SongCard` | 1:1 cover (image-slot) · serif 제목 · sans 아티스트     |
| `LyricsCard`| status badge · 5줄 미리보기 (serif) · 제목 + 작가     |
| `AlbumCard`| 1:1 cover + 좌상단 "ALBUM · n곡" 배지 · concept 인용 |

모든 카드 cover는 `<image-slot id="...">`로, 사용자가 직접 드롭한 이미지가 영구 저장됨.

### 7.5 Waveform Player

- `<WaveformPlayer duration={228}/>` — 92개 막대로 곡 전체 표시
- 재생 진행 중인 막대는 액센트 컬러, 미재생은 `--bd-2`
- 클릭으로 시킹
- 재생 중 가장 앞 막대는 `chohee-wave` 애니메이션

### 7.6 Footer Player

- 화면 하단 고정 (`bottom: 16px`, 좌우 16px 마진)
- 글래스모피즘: `backdrop-filter: blur(20px) saturate(160%)`
- 3 컬럼: 좌측 곡 정보 · 중앙 컨트롤 + 진행바 · 우측 메타 액션

### 7.7 Lyrics Viewer

- `.lyrics` 클래스 적용
- `<div class="stanza">…</div>`로 연 단위 구분
- 후렴 강조: `style="color: var(--accent)"` 또는 `font-style: italic`
- 행번호 표시 옵션: 좌측 마진에 mono 폰트로 (가사 전용 페이지 한정)

### 7.8 Comment

- 가사의 한 줄을 인용 가능한 `lyricsAnchor` prop
- 인용은 `border-left: 2px solid var(--accent)` + italic serif
- Hue를 고정 시드로 부여해 아바타 색 일관성 확보

### 7.9 Dropzone

- 드래그 중: 경계 액센트, 배경 `--accent-soft`
- 평상시: 1.5px 점선 경계
- 내부에 아이콘 + 1줄 안내 + 1줄 hint + 파일 선택 버튼

### 7.10 Sidebar / TopBar

- Sidebar 248px, 다크 0단계 배경
- 메뉴 active 표시: `--accent-soft` 배경 + `--accent` 텍스트
- 두 그룹: 탐색(홈/둘러보기/라이브러리) · 창작(곡/가사/앨범 만들기)
- TopBar는 sticky + 글래스, 검색 가운데 480px max

---

## 8. Tailwind preset 매핑

`tailwind.config.js`에 다음과 같이 토큰을 연결한다.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: { 0: 'var(--bg-0)', 1: 'var(--bg-1)', 2: 'var(--bg-2)', 3: 'var(--bg-3)', 4: 'var(--bg-4)' },
        fg: { 1: 'var(--fg-1)', 2: 'var(--fg-2)', 3: 'var(--fg-3)', 4: 'var(--fg-4)' },
        bd: { 1: 'var(--bd-1)', 2: 'var(--bd-2)' },
        accent:     { DEFAULT: 'var(--accent)', soft: 'var(--accent-soft)', fg: 'var(--accent-fg)', 2: 'var(--accent-2)' },
        status: {
          waiting:    'var(--st-waiting)',
          generating: 'var(--st-progress)',
          complete:   'var(--st-complete)',
          revision:   'var(--st-revision)',
        },
        info:    'var(--info)',
        success: 'var(--success)',
        warn:    'var(--warn)',
        danger:  'var(--danger)',
      },
      fontFamily: {
        sans:  ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono:  ['var(--font-mono)'],
      },
      spacing: {
        1: '4px', 2: '8px', 3: '12px', 4: '16px',
        5: '20px', 6: '24px', 8: '32px', 10: '40px',
        12: '48px', 16: '64px', 20: '80px', 24: '96px',
      },
      borderRadius: {
        xs: '4px', sm: '6px', md: '10px', lg: '14px', xl: '20px',
      },
      boxShadow: {
        1: 'var(--sh-1)', 2: 'var(--sh-2)', 3: 'var(--sh-3)',
      },
      transitionDuration: {
        fast: '120ms', base: '200ms', slow: '360ms', page: '480ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
        out:     'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    // Lyrics utility
    function ({ addComponents }) {
      addComponents({
        '.lyrics': {
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          lineHeight: '1.95',
          letterSpacing: '0.01em',
          color: 'var(--fg-1)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all',
          textWrap: 'pretty',
        },
        '.lyrics-lg': { fontSize: '28px', lineHeight: '2.05' },
        '.lyrics-xl': { fontSize: '36px', lineHeight: '2.0', letterSpacing: '0.012em' },
      });
    },
  ],
};
```

`tokens.css`를 `@layer base`에 import하면 위 토큰들이 모든 페이지에 적용된다.

---

## 9. 화면 목록 (구현된 시안)

| 화면                      | 형태/메타포                             | 파일                                   |
| ------------------------- | --------------------------------------- | -------------------------------------- |
| 홈 / 랜딩                  | 가사 hero + 곡/가사/앨범 그리드          | `screens/home-album.jsx` · `HomeScreen` |
| 앨범 페이지                | 트랙리스트 두 컬럼: 곡 vs 음악 대기 가사 | `screens/home-album.jsx` · `AlbumScreen` |
| 곡 상세                   | 큰 커버 + 파형 + 가사 영역              | `screens/song-lyrics.jsx` · `SongDetailScreen` |
| 가사 상세 (실험적)         | 신문 마스트헤드 + 행번호 + 각주식 메타  | `screens/song-lyrics.jsx` · `LyricsDetailScreen` |
| 곡 업로드                  | 3단계 플로우 · 파일 사이드 카드          | `screens/upload-dashboard.jsx` · `UploadScreen` |
| 가사 작성 에디터           | 시집 에디터 + 음악 요청 옵션 패널        | `screens/search-write-login.jsx` · `WriteScreen` |
| 크리에이터 대시보드        | 생성 요청 카드 중심 + 통계 + 곡 목록     | `screens/upload-dashboard.jsx` · `DashboardScreen` |
| 검색 결과                  | Top Match + 곡/가사/창작자/앨범 섹션    | `screens/search-write-login.jsx` · `SearchScreen` |
| 로그인 (카카오)            | 가사 한 연 hero + 카카오 버튼           | `screens/search-write-login.jsx` · `LoginScreen` |

모든 화면은 **Chohee Design System.html** 단일 파일에서 디자인 캔버스로 펼쳐져 있다. 우측 하단 Tweaks 패널에서 액센트 4종과 가사 스케일을 실시간 비교 가능.

---

## 10. 유지 원칙

1. **새 색을 추가하지 말 것.** 새 의도가 생기면 기존 시맨틱 토큰 중에서 고른다. 시즌 운영 시에만 액센트를 mustard ↔ amber ↔ terracotta ↔ coral로 교체.
2. **가사에는 sans-serif를 쓰지 말 것.** 가사 미리보기 카드부터 풀 페이지까지 모두 serif.
3. **상태 배지에 임의 색을 쓰지 말 것.** 4종 외 새 상태가 필요하면 운영팀과 협의 후 토큰 신설.
4. **모서리는 픽셀로 쓰지 말 것.** `--r-*` 토큰만 사용. `border-radius: 8px` 같은 raw 값 금지.
5. **모션은 200ms 안팎으로.** 600ms 이상 애니메이션은 페이지 전환 외에 쓰지 않는다.
