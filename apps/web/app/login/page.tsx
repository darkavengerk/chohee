import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Lyrics } from '@chohee/ui';
import { Brand } from '@/components/Brand';
import { getCurrentUserFromServer } from '@/lib/auth';
import { LoginActions } from './LoginActions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const me = await getCurrentUserFromServer();
  if (me) redirect(searchParams.next ?? '/me');

  return (
    <div className="grain flex min-h-screen flex-col items-center justify-center bg-bg-0 px-6">
      <div className="absolute left-10 top-8">
        <Brand />
      </div>
      <div className="grid w-full max-w-[920px] grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-fg-4">오늘의 한 연</p>
          <Lyrics
            size="xl"
            className="mt-4"
            text={
              '당신이 쓴 한 줄이\n다른 누군가의 새벽이 되고\n그가 입힌 멜로디가\n다시 당신에게 돌아옵니다.'
            }
          />
          <p className="mt-6 text-[12px] text-fg-3">초희</p>
        </div>
        <div className="flex flex-col gap-5 rounded-xl border border-bd-1 bg-bg-1 p-8 shadow-2">
          <div>
            <h1 className="font-serif text-[26px] text-fg-1">초희에 들어가기</h1>
            <p className="mt-1 text-[13px] text-fg-3">카카오 계정으로 1초 만에 시작합니다.</p>
          </div>
          <LoginActions nextPath={searchParams.next} />
          <p className="mt-2 text-[11.5px] leading-[1.7] text-fg-4">
            계속 진행하시면{' '}
            <Link className="underline hover:text-fg-2" href="/legal/terms">
              이용약관
            </Link>{' '}
            과{' '}
            <Link className="underline hover:text-fg-2" href="/legal/privacy">
              개인정보처리방침
            </Link>
            에 동의한 것으로 간주합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
