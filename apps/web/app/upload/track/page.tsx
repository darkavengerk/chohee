import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';
import { TrackUploadFlow } from './TrackUploadFlow';

export default async function TrackUploadPage() {
  const me = await getCurrentUserFromServer();
  if (!me) redirect('/login?next=/upload/track');
  return (
    <AppShell activeKey="upload-track" rightActions={<UserMenu user={me} />}>
      <div className="mx-auto max-w-[920px]">
        <h1 className="font-serif text-[32px] text-fg-1">곡 올리기</h1>
        <p className="mt-2 text-[13px] text-fg-3">
          음원 파일을 끌어다 놓으면 브라우저에서 직접 128/192/320 kbps로 인코딩한 뒤 안전하게
          업로드합니다. 서버에서는 트랜스코딩이 일어나지 않습니다.
        </p>
        <div className="mt-10">
          <TrackUploadFlow />
        </div>
      </div>
    </AppShell>
  );
}
