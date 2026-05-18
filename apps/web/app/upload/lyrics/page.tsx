import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';
import { LyricsWriteFlow } from './LyricsWriteFlow';

export default async function LyricsUploadPage() {
  const me = await getCurrentUserFromServer();
  if (!me) redirect('/login?next=/upload/lyrics');
  return (
    <AppShell activeKey="upload-lyrics" rightActions={<UserMenu user={me} />}>
      <div className="mx-auto max-w-[1080px]">
        <h1 className="font-serif text-[32px] text-fg-1">가사 쓰기</h1>
        <p className="mt-2 text-[13px] text-fg-3">
          시집의 호흡으로 가사를 작성합니다. 작성 후 음악 생성을 요청하면 운영자가 음악을 입혀
          돌려보내드립니다.
        </p>
        <div className="mt-10">
          <LyricsWriteFlow />
        </div>
      </div>
    </AppShell>
  );
}
