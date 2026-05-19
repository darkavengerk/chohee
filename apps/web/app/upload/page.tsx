import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';

const cards = [
  {
    href: '/upload/track',
    title: '곡 올리기',
    description: '완성된 음원을 멀티 비트레이트로 인코딩하여 업로드합니다.',
    accent: '완성곡',
  },
  {
    href: '/upload/lyrics',
    title: '가사 쓰기',
    description: '가사만 먼저 공유합니다. 다른 사용자들이 음악을 입혀 제안하고, 그중 하나를 채택할 수 있습니다.',
    accent: '가사 → 음악',
  },
  {
    href: '/upload/album',
    title: '앨범 만들기',
    description: '하나의 컨셉으로 곡과 가사를 묶어 호흡을 만듭니다.',
    accent: '컨셉',
  },
];

export const runtime = 'edge';

export default async function UploadHubPage() {
  const me = await getCurrentUserFromServer();
  if (!me) redirect('/login?next=/upload');
  return (
    <AppShell activeKey="upload-track" rightActions={<UserMenu user={me} />}>
      <div className="mx-auto max-w-[860px]">
        <h1 className="font-serif text-[36px] text-fg-1">무엇을 올릴까요?</h1>
        <p className="mt-3 text-[14px] text-fg-3">
          초희에는 세 가지 콘텐츠가 함께 살아갑니다. 완성된 곡, 음악을 기다리는 가사, 그리고
          그것들을 묶는 앨범.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col rounded-lg border border-bd-1 bg-bg-1 p-6 shadow-1 transition duration-base hover:border-accent/40 hover:shadow-2"
            >
              <span className="mb-3 inline-flex w-fit items-center rounded-pill border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium text-accent">
                {c.accent}
              </span>
              <p className="font-serif text-[22px] text-fg-1 group-hover:text-accent">{c.title}</p>
              <p className="mt-2 text-[13px] leading-[1.7] text-fg-3">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
