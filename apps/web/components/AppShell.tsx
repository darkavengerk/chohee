'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Sidebar, TopBar, Input } from '@chohee/ui';
import { Brand } from './Brand';

interface AppShellProps {
  children: ReactNode;
  activeKey?: string;
  rightActions?: ReactNode;
}

export function AppShell({ children, activeKey, rightActions }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-bg-0">
      <Sidebar
        activeKey={activeKey}
        brand={<Brand />}
        linkComponent={({ href, children, className }) => (
          <Link href={href} className={className}>
            {children}
          </Link>
        )}
        groups={[
          {
            label: '탐색',
            items: [
              { key: 'home', label: '홈', href: '/' },
              { key: 'discover', label: '둘러보기', href: '/discover' },
              { key: 'library', label: '내 라이브러리', href: '/me' },
            ],
          },
          {
            label: '창작',
            items: [
              { key: 'upload-track', label: '곡 올리기', href: '/upload/track' },
              { key: 'upload-lyrics', label: '가사 쓰기', href: '/upload/lyrics' },
              { key: 'upload-album', label: '앨범 만들기', href: '/upload/album' },
            ],
          },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <TopBar
          search={
            <Input
              placeholder="곡, 가사, 창작자 검색"
              leftSlot={<span className="text-fg-3">⌕</span>}
              className="text-[13px]"
            />
          }
          actions={rightActions}
        />
        <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
