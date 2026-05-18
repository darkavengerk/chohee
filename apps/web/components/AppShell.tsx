'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Sidebar, TopBar, Input, Icon } from '@chohee/ui';
import { Brand } from './Brand';

interface AppShellProps {
  children: ReactNode;
  activeKey?: string;
  rightActions?: ReactNode;
}

const SIDEBAR_GROUPS = [
  {
    label: '탐색',
    items: [
      { key: 'home', label: '홈', href: '/', icon: <Icon name="home" size={17} /> },
      { key: 'discover', label: '둘러보기', href: '/discover', icon: <Icon name="search" size={17} /> },
      { key: 'library', label: '내 라이브러리', href: '/me', icon: <Icon name="library" size={17} /> },
    ],
  },
  {
    label: '창작',
    items: [
      { key: 'upload-track', label: '곡 올리기', href: '/upload/track', icon: <Icon name="music" size={17} /> },
      { key: 'upload-lyrics', label: '가사 쓰기', href: '/upload/lyrics', icon: <Icon name="pen" size={17} /> },
      { key: 'upload-album', label: '앨범 만들기', href: '/upload/album', icon: <Icon name="album" size={17} /> },
    ],
  },
];

export function AppShell({ children, activeKey, rightActions }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // 라우트 변경 시 드로어 자동 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // 열려 있을 때 body 스크롤 잠금 + ESC로 닫기
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const linkComponent = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <Link href={href} className={className}>
      {children}
    </Link>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-bg-0">
      {/* Desktop sidebar (lg+) */}
      <div className="hidden lg:flex">
        <Sidebar
          activeKey={activeKey}
          brand={<Brand />}
          linkComponent={linkComponent}
          groups={SIDEBAR_GROUPS}
        />
      </div>

      {/* Mobile drawer (lg 미만에서만 활성화) */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <div
        className={
          'fixed inset-y-0 left-0 z-40 transition-transform duration-base lg:hidden ' +
          (mobileOpen ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <Sidebar
          activeKey={activeKey}
          brand={<Brand />}
          linkComponent={linkComponent}
          groups={SIDEBAR_GROUPS}
          className="shadow-3"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          leftSlot={
            <button
              type="button"
              aria-label="메뉴 열기"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 transition duration-fast hover:bg-bg-2 hover:text-fg-1 lg:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
          }
          search={
            <Input
              placeholder="검색"
              leftSlot={<Icon name="search" size={14} className="text-fg-3" />}
              className="text-[13px]"
            />
          }
          actions={rightActions}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
