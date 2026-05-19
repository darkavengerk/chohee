import Link from 'next/link';
import {
  AlbumCard,
  Badge,
  Chip,
  LyricsCard,
  SongCard,
  Lyrics,
  type MusicGenerationStatus,
} from '@chohee/ui';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';


// Phase 1: API에 콘텐츠가 없어도 화면이 동작하도록 데모 데이터를 표시.
// 데이터가 채워지면 fetch로 교체할 예정.

const demoSongs = [
  { id: 's1', title: '새벽 세 시의 라디오', artist: '유진', duration: '3:48' },
  { id: 's2', title: '두 정거장 후', artist: '한솔', duration: '3:12' },
  { id: 's3', title: '마지막 라일락', artist: '유진 × 도윤', duration: '4:04' },
  { id: 's4', title: '비가 내릴 줄 알았어', artist: '민서', duration: '3:21' },
  { id: 's5', title: '파주 가는 길', artist: '지혁', duration: '3:07' },
  { id: 's6', title: '여름의 끝', artist: '유진', duration: '3:33' },
];

const demoLyrics: {
  id: string;
  title: string;
  author: string;
  status: MusicGenerationStatus;
  preview: string;
  lineCount: number;
}[] = [
  {
    id: 'l1',
    title: '겨울 우체국',
    author: '수민',
    status: 'generating',
    lineCount: 22,
    preview:
      '당신에게 부치지 못한 편지가\n책상 위에서 다시 잠이 든다.\n계절을 두 번 보내고도\n아직 우표를 사지 못한 채.',
  },
  {
    id: 'l2',
    title: '느린 도시',
    author: '준영',
    status: 'waiting',
    lineCount: 18,
    preview:
      '이 도시의 모든 신호등은\n빨강에서 시작한다.\n나는 그것을\n약속이라고 부르기로 했다.',
  },
  {
    id: 'l3',
    title: '흰 손수건',
    author: '예린',
    status: 'waiting',
    lineCount: 26,
    preview: '주머니 속에 손수건을\n잊은 지 오래되었다.\n그 속에 접어둔 말도\n함께 잊었다.',
  },
];

const demoAlbums = [
  { id: 'a1', title: '정거장 가까이', artist: '한솔', tracks: 6, concept: '마지막 정거장에서 첫 정거장까지' },
  { id: 'a2', title: '비의 다섯 가지', artist: '유진', tracks: 5, concept: '비가 내리는 다섯 개의 풍경' },
  { id: 'a3', title: '도시의 낮잠', artist: '민서 × 도윤', tracks: 7, concept: '오후 두 시의 도시 소음과 침묵' },
  { id: 'a4', title: '이름 없는 것들', artist: '예린', tracks: 4, concept: '이름을 잃어버린 것들에 대한 헌사' },
];

export default async function HomePage() {
  const me = await getCurrentUserFromServer();
  return (
    <AppShell activeKey="home" rightActions={<UserMenu user={me} />}>
      <section className="mb-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
          <div className="flex flex-col justify-between rounded-xl border border-bd-1 bg-bg-1 p-6 shadow-1 sm:p-8 lg:p-10">
            <div>
              <Badge tone="accent" className="mb-4">
                가사가 음악이 되는 공간
              </Badge>
              <h1 className="font-serif text-[28px] leading-[1.2] tracking-[0.005em] text-fg-1 sm:text-[34px] sm:leading-[1.15] lg:text-[40px]">
                당신이 쓴 한 줄이
                <br />
                노래가 되어 돌아옵니다
              </h1>
              <p className="mt-4 max-w-[520px] text-[13px] leading-[1.7] text-fg-2 sm:text-[14px]">
                초희는 AI로 만든 음악을 공유하는 한국어 스트리밍 플랫폼이자, 가사만으로도 작품을
                나눌 수 있는 공간입니다. 다른 창작자들이 당신의 가사에 음악을 입혀 제안하고,
                당신은 그중 하나를 채택해 공식 음원으로 만듭니다.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <Link
                href="/upload/lyrics"
                className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-accent-fg transition duration-fast hover:brightness-110 sm:px-5 sm:py-2.5"
              >
                가사 쓰기
              </Link>
              <Link
                href="/upload/track"
                className="rounded-md border border-bd-2 bg-bg-2 px-4 py-2 text-[13px] font-medium text-fg-1 transition duration-fast hover:bg-bg-3 sm:px-5 sm:py-2.5"
              >
                곡 올리기
              </Link>
              <Link
                href="/discover"
                className="rounded-md bg-transparent px-4 py-2 text-[13px] font-medium text-fg-2 transition duration-fast hover:text-fg-1 sm:px-5 sm:py-2.5"
              >
                먼저 둘러보기
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-xl border border-bd-1 bg-bg-1 p-6 shadow-1 sm:p-8">
            <p className="text-[11px] uppercase tracking-wider text-fg-4">오늘의 한 연</p>
            <Lyrics
              size="lg"
              className="mt-4"
              text={
                '이 도시의 모든 신호등은\n빨강에서 시작한다.\n나는 그것을\n약속이라고 부르기로 했다.'
              }
            />
            <p className="mt-6 text-[12px] text-fg-3">— 준영 「느린 도시」</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          {['전체', '곡', '가사', '앨범'].map((label, i) => (
            <Chip key={label} active={i === 0}>
              {label}
            </Chip>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <SectionHeader kicker="LYRICS · 음악을 기다립니다" title="새 가사" />
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {demoLyrics.map((l) => (
            <LyricsCard key={l.id} {...l} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <SectionHeader kicker="SONGS · 이번 주 완성" title="새 곡" />
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {demoSongs.map((s) => (
            <SongCard key={s.id} {...s} durationLabel={s.duration} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeader kicker="ALBUMS · 한 호흡으로 묶인" title="새 앨범" />
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {demoAlbums.map((a) => (
            <AlbumCard
              key={a.id}
              id={a.id}
              title={a.title}
              artist={a.artist}
              trackCount={a.tracks}
              concept={a.concept}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          {kicker}
        </p>
        <h2 className="font-serif text-[26px] font-medium leading-tight tracking-[0.005em] text-fg-1">
          {title}
        </h2>
      </div>
      <Link
        href="/discover"
        className="text-[12px] text-fg-3 transition duration-fast hover:text-fg-1"
      >
        전체 보기 →
      </Link>
    </div>
  );
}
