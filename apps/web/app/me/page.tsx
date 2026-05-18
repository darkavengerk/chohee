import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Avatar, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@chohee/ui';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';
import { serverFetch } from '@/lib/api-client';
import { cookies } from 'next/headers';
import type { PaginatedResult, Track, Lyrics, Album } from '@chohee/shared';

export default async function MePage() {
  const me = await getCurrentUserFromServer();
  if (!me) redirect('/login?next=/me');
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const [tracksRes, lyricsRes, albumsRes] = await Promise.all([
    serverFetch<PaginatedResult<Track>>(`/tracks?userId=${me.id}&limit=20`, { cookieHeader }),
    serverFetch<PaginatedResult<Lyrics>>(`/lyrics?userId=${me.id}&limit=20`, { cookieHeader }),
    serverFetch<PaginatedResult<Album>>(`/albums?userId=${me.id}&limit=20`, { cookieHeader }),
  ]);

  const tracks = tracksRes.ok ? tracksRes.data.items : [];
  const lyrics = lyricsRes.ok ? lyricsRes.data.items : [];
  const albums = albumsRes.ok ? albumsRes.data.items : [];

  return (
    <AppShell activeKey="library" rightActions={<UserMenu user={me} />}>
      <section className="mb-8 flex flex-col items-start gap-4 border-b border-bd-1 pb-8 sm:flex-row sm:items-center sm:gap-6">
        <Avatar name={me.displayName} src={me.avatarUrl ?? undefined} size="xl" />
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="break-keep font-serif text-[24px] text-fg-1 sm:text-[28px]">
            {me.displayName}
          </h1>
          <p className="break-all text-[12px] text-fg-3">
            @{me.handle}
            {me.email ? ` · ${me.email}` : ''}
          </p>
          {me.bio && <p className="mt-2 break-keep text-[13px] leading-[1.7] text-fg-2">{me.bio}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href="/me/edit"
              className="rounded-md border border-bd-2 bg-bg-2 px-3 py-1.5 text-[12px] font-medium text-fg-1 transition duration-fast hover:bg-bg-3"
            >
              프로필 수정
            </Link>
            {me.isAdmin && (
              <Badge tone="accent">
                <span className="mono">ADMIN</span>
              </Badge>
            )}
          </div>
        </div>
      </section>

      <Tabs defaultValue="tracks">
        <TabsList>
          <TabsTrigger value="tracks">곡 {tracks.length}</TabsTrigger>
          <TabsTrigger value="lyrics">가사 {lyrics.length}</TabsTrigger>
          <TabsTrigger value="albums">앨범 {albums.length}</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="tracks">
            {tracks.length === 0 ? (
              <EmptyState
                title="아직 올린 곡이 없습니다"
                description="완성된 음원을 올려 자신만의 카탈로그를 만들어보세요"
                actionLabel="곡 올리기"
                actionHref="/upload/track"
              />
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {tracks.map((t) => (
                  <li key={t.id} className="rounded-lg border border-bd-1 bg-bg-1 p-4">
                    <p className="font-serif text-[16px] text-fg-1">{t.title}</p>
                    <p className="mt-1 text-[11.5px] text-fg-3">
                      {Math.round(t.durationMs / 1000)}초 · {t.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="lyrics">
            {lyrics.length === 0 ? (
              <EmptyState
                title="아직 쓴 가사가 없습니다"
                description="첫 가사를 쓰고 음악을 입혀달라 요청해보세요"
                actionLabel="가사 쓰기"
                actionHref="/upload/lyrics"
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {lyrics.map((l) => (
                  <li key={l.id} className="rounded-lg border border-bd-1 bg-bg-1 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-[16px] text-fg-1">{l.title}</p>
                      <span className="mono text-[10.5px] text-fg-4">
                        {l.generationRequestStatus ?? '미요청'}
                      </span>
                    </div>
                    <p className="lyrics mt-2 line-clamp-3 text-[14px] text-fg-2">{l.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="albums">
            {albums.length === 0 ? (
              <EmptyState
                title="아직 만든 앨범이 없습니다"
                description="하나의 컨셉으로 곡과 가사를 묶어보세요"
                actionLabel="앨범 만들기"
                actionHref="/upload/album"
              />
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {albums.map((a) => (
                  <li key={a.id} className="rounded-lg border border-bd-1 bg-bg-1 p-4">
                    <p className="font-serif text-[16px] text-fg-1">{a.title}</p>
                    <p className="mt-1 text-[11.5px] text-fg-3">{a.itemCount}개 항목 · {a.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </AppShell>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-bd-2 bg-bg-1 px-6 py-12 text-center">
      <p className="font-serif text-[18px] text-fg-1">{title}</p>
      <p className="text-[13px] text-fg-3">{description}</p>
      <Link
        href={actionHref}
        className="mt-2 rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-accent-fg transition duration-fast hover:brightness-110"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
