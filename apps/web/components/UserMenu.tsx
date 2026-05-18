'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, Button } from '@chohee/ui';
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
  return (
    <div className="flex items-center gap-3">
      <Link href="/me" className="flex items-center gap-2 text-[13px] text-fg-2 hover:text-fg-1">
        <Avatar name={user.displayName} src={user.avatarUrl ?? undefined} size="sm" />
        <span>@{user.handle}</span>
      </Link>
      <Button
        size="sm"
        variant="ghost"
        onClick={async () => {
          await apiFetch('/auth/logout', { method: 'POST' });
          router.refresh();
          router.push('/');
        }}
      >
        로그아웃
      </Button>
    </div>
  );
}
