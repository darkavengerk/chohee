'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Icon } from '@chohee/ui';
import { apiFetch } from '@/lib/api-client';
import type { CurrentUser } from '@chohee/shared';

export function UserMenu({ user }: { user: CurrentUser | null }) {
  const router = useRouter();

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="primary" size="sm">
          로그인
        </Button>
      </Link>
    );
  }

  async function onLogout() {
    await apiFetch('/auth/logout', { method: 'POST' });
    router.refresh();
    router.push('/');
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href="/me"
        className="flex items-center gap-2 rounded-pill border border-bd-1 bg-bg-2 py-1 pl-1 pr-3 text-[13px] text-fg-1 transition duration-fast hover:bg-bg-3"
      >
        <Avatar name={user.displayName} src={user.avatarUrl ?? undefined} size="sm" />
        <span className="font-medium">@{user.handle}</span>
      </Link>
      <button
        type="button"
        onClick={onLogout}
        aria-label="로그아웃"
        title="로그아웃"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-3 transition duration-fast hover:bg-bg-2 hover:text-fg-1"
      >
        <Icon name="logout" size={16} />
      </button>
    </div>
  );
}
