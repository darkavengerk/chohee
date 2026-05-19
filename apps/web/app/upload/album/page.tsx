import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';
import { AlbumCreateFlow } from './AlbumCreateFlow';
import { serverFetch } from '@/lib/api-client';
import { cookies } from 'next/headers';
import type { PaginatedResult, Track, Lyrics } from '@chohee/shared';

export const runtime = 'edge';

export default async function AlbumCreatePage() {
  const me = await getCurrentUserFromServer();
  if (!me) redirect('/login?next=/upload/album');
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  const [tracksRes, lyricsRes] = await Promise.all([
    serverFetch<PaginatedResult<Track>>(`/tracks?userId=${me.id}&limit=50`, { cookieHeader }),
    serverFetch<PaginatedResult<Lyrics>>(`/lyrics?userId=${me.id}&limit=50`, { cookieHeader }),
  ]);
  const myTracks = tracksRes.ok ? tracksRes.data.items : [];
  const myLyrics = lyricsRes.ok ? lyricsRes.data.items : [];

  return (
    <AppShell activeKey="upload-album" rightActions={<UserMenu user={me} />}>
      <div className="mx-auto max-w-[1080px]">
        <h1 className="font-serif text-[32px] text-fg-1">앨범 만들기</h1>
        <p className="mt-2 text-[13px] text-fg-3">
          하나의 컨셉으로 곡과 가사를 묶습니다. 음악이 아직 없는 가사도 앨범 안에서 다른 곡들과
          함께 호흡할 수 있어요.
        </p>
        <div className="mt-10">
          <AlbumCreateFlow myTracks={myTracks} myLyrics={myLyrics} />
        </div>
      </div>
    </AppShell>
  );
}
