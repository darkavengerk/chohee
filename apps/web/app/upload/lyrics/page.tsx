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
          시집의 호흡으로 가사를 작성합니다. &ldquo;음악 제안 받기&rdquo;를 켜두면 다른 사용자들이 이
          가사에 음악을 입혀 제안하고, 당신은 그중 하나를 채택해 공식 음원으로 지정할 수
          있습니다.
        </p>
        <div className="mt-10">
          <LyricsWriteFlow />
        </div>
      </div>
    </AppShell>
  );
}
