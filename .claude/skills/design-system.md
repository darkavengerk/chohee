# 디자인 시스템 사용 가이드

> Chohee 디자인 시스템(`packages/ui`)을 일관되게 사용하는 방법. **Svelte 5 runes 기반.**

## 언제 사용하는가

- 새로운 페이지나 컴포넌트를 만들 때
- 색상·간격·모서리·그림자를 적용할 때
- 가사를 화면에 표시할 때
- 카드, 버튼, 입력 등 베이스 컴포넌트가 필요할 때

## 절대 규칙

1. **색상/사이즈/모서리를 하드코딩하지 말 것.** `text-[#f5f1e8]`, `rounded-[12px]` 같은 raw 값은 금지. 모두 토큰을 거친다.
2. **가사에는 sans-serif를 쓰지 말 것.** 가사 카드부터 풀 페이지까지 모두 `font-serif` 또는 `.lyrics` 클래스.
3. **상태 배지는 `<StatusBadge>`만 사용.** 4가지(waiting/generating/complete/revision) 외엔 새로 만들지 않는다.
4. **모션은 200ms 안팎으로.** `duration-fast`(120ms), `duration-base`(200ms), `duration-slow`(360ms). 600ms 이상은 페이지 전환만.
5. **버튼/입력의 모서리는 항상 `rounded-md` (10px).** 카드/모달은 `rounded-lg` (14px). hero/큰 컨테이너만 `rounded-xl` (20px).

## Tailwind 토큰

| 종류 | 클래스 | 의미 |
|---|---|---|
| 표면 | `bg-bg-0` ~ `bg-bg-4` | 0이 가장 깊은 페이지 배경, 4가 가장 밝은 디바이더 |
| 텍스트 | `text-fg-1` ~ `text-fg-4` | 1이 강조, 4가 비활성/행번호 |
| 경계 | `border-bd-1`, `border-bd-2` | 1이 기본, 2가 강조 |
| 액센트 | `bg-accent`, `text-accent`, `bg-accent-soft`, `text-accent-fg` | 기본은 pine(딥 그린). fg는 accent 위 텍스트 |
| 시맨틱 | `text-info`, `text-success`, `text-warn`, `text-danger` | 차가운 톤은 시맨틱에서만 |
| 상태 | `bg-status-waiting`, `bg-status-generating` 등 | 음악 생성 상태 4종 |
| 간격 | `p-1` (4px) ~ `p-24` (96px) | 4px 베이스. 1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48, 16=64, 20=80, 24=96 |
| 모서리 | `rounded-xs/sm/md/lg/xl/pill` | 4/6/10/14/20/999px |
| 그림자 | `shadow-1`, `shadow-2`, `shadow-3`, `shadow-glow` | 다크 위에서는 약하게 |
| 폰트 | `font-sans`, `font-serif`, `font-mono` | sans=Pretendard, serif=Noto Serif KR, mono=JetBrains Mono |

토큰은 CSS variables(`packages/ui/src/styles/tokens.css`)을 Tailwind preset에서 `oklch(from var(--token) l c h / <alpha-value>)`로 감싸 노출 — `bg-accent/20` 같은 슬래시 알파 모디파이어가 동작.

## 컴포넌트 빠르게 보기

```svelte
<script lang="ts">
  import {
    Button, Input, Textarea, Card, Badge, StatusBadge, Chip, Avatar, ProgressBar,
    DropZone, Tabs, TabsList, TabsTrigger, TabsContent, Toast, Dialog,
    Lyrics, Waveform, Sidebar, TopBar, CoverArt, SongCard, LyricsCard, AlbumCard,
    FooterPlayer, Icon,
  } from '@chohee/ui';
</script>
```

- **Button**: `variant: 'primary'|'secondary'|'outline'|'ghost'|'danger'`, `size: 'sm'|'md'|'lg'`. `loading`, `leftIcon`/`rightIcon` snippet, `fullWidth`.
- **StatusBadge**: `status: 'waiting'|'generating'|'complete'|'revision'`. 라벨과 색은 자동.
- **Lyrics**: `<Lyrics text={...} size="base|lg|xl" showLineNumbers />`. 빈 줄로 연 구분. serif + keep-all.
- **DropZone**: `accept`, `multiple`, `onFiles`, `title`, `hint`. 드래그 중 액센트 배경.
- **Waveform**: `durationSeconds`, `positionSeconds`, `playing`, `onSeek`. 기본 92 막대.
- **Icon**: `<Icon name="home" size={17} />` — currentColor 따름.

### AppShell 패턴 (web 앱)

`apps/web/src/lib/components/AppShell.svelte` 정도에 두고, 각 페이지 `+page.svelte`에서 wrap. Sidebar + TopBar + 메인 콘텐츠를 묶어 layout처럼 동작. 또는 `+layout.svelte`에 직접 두면 더 자연스러움.

## 가사 작성/표시 규칙

```svelte
<Lyrics text={l.text} size="lg" />
```

- 사이즈: `base`(22px) — 카드/상세, `lg`(28px) — 앨범 페이지, `xl`(36px) — 가사 전용 페이지
- 작가의 줄바꿈 보존 (pre-wrap). 자동 가운데 정렬 금지.
- 후렴 강조는 `color: var(--accent)` 또는 `font-style: italic`만.
- 행번호 표시는 가사 전용 페이지에서만 (`showLineNumbers`).

## 액센트 변경 (시즌 운영)

루트 `<html data-accent="pine">`가 기본. `pine | moss | sage | mustard | amber | terracotta | coral` 중 하나로 교체.
- **녹색 계열** (기본 라인업): `pine`(딥 포레스트), `moss`(웜 모스), `sage`(소프트 세이지)
- **웜 계열** (보조/시즌): `mustard`, `amber`, `terracotta`, `coral`

녹색 정체성을 더 강조하려면 `<html data-accent="pine" data-base="green">`로 표면 언더톤까지 녹색으로 시프트. 시스템 전체가 따라 움직인다. 새 색을 추가하지 않는다.

SvelteKit에서는 `apps/web/src/app.html`의 `<html>` 태그에 속성을 직접 적용:

```html
<html lang="ko" data-accent="pine">
  ...
</html>
```

## Svelte 컴포넌트 작성 패턴 (Svelte 5)

```svelte
<script lang="ts">
  type Props = {
    title: string;
    onclick?: () => void;
  };
  let { title, onclick }: Props = $props();
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    console.log('mounted or count changed', count);
  });
</script>

<button onclick={() => { count++; onclick?.(); }}>
  {title}: {count} (×2 = {doubled})
</button>
```

- `$props()` for inputs (Svelte 4의 `export let` 대체)
- `$state()` for reactive local state
- `$derived()` for computed values
- `$effect()` for side effects (mount + reactive)
- 이벤트 핸들러: `on:click` → `onclick` (Svelte 5)

## 흔한 실수

- `text-white`, `bg-gray-900` 같은 Tailwind 기본 팔레트 사용 → 토큰 클래스 사용
- 카드에 `shadow-lg` (Tailwind 기본) → `shadow-2` (디자인 토큰)
- `transition-all duration-300` → `transition duration-base`
- 가사 카드에 `font-sans` → 반드시 `font-serif` 또는 `<Lyrics>` 사용
- Svelte 4의 `export let foo` 사용 → `$props()` 사용
- `on:click={handler}` → `onclick={handler}` (Svelte 5 attribute 형식)
