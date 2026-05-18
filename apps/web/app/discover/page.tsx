import { Chip } from '@chohee/ui';
import { AppShell } from '@/components/AppShell';
import { UserMenu } from '@/components/UserMenu';
import { getCurrentUserFromServer } from '@/lib/auth';

export default async function DiscoverPage() {
  const me = await getCurrentUserFromServer();
  return (
    <AppShell activeKey="discover" rightActions={<UserMenu user={me} />}>
      <div className="mx-auto max-w-[920px]">
        <h1 className="font-serif text-[32px] text-fg-1">둘러보기</h1>
        <p className="mt-2 text-[13px] text-fg-3">
          새로 도착한 곡과 가사, 그리고 앨범을 컨셉별로 살펴봅니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['전체', '잔잔한', '몽환적인', '서정적인', '리드미컬한', '도시적인', '계절감'].map(
            (t, i) => (
              <Chip key={t} active={i === 0}>
                {t}
              </Chip>
            ),
          )}
        </div>
        <p className="mt-12 rounded-lg border border-dashed border-bd-2 bg-bg-1 px-6 py-16 text-center text-[13px] text-fg-3">
          Phase 2에서 검색·필터·추천이 채워질 영역입니다.
        </p>
      </div>
    </AppShell>
  );
}
