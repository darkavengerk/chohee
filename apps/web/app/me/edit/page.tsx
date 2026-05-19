import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';
import { EditProfileForm } from './EditProfileForm';


export default async function EditProfilePage() {
  const me = await getCurrentUserFromServer();
  if (!me) redirect('/login?next=/me/edit');
  return (
    <AppShell activeKey="library" rightActions={<UserMenu user={me} />}>
      <div className="max-w-[640px]">
        <h1 className="font-serif text-[28px] text-fg-1">프로필 수정</h1>
        <p className="mt-2 text-[13px] text-fg-3">
          핸들은 다른 사용자에게 노출되는 고유 식별자입니다. 한 번 정하면 자주 바꾸지 않는 편이
          좋습니다.
        </p>
        <div className="mt-8">
          <EditProfileForm me={me} />
        </div>
      </div>
    </AppShell>
  );
}
