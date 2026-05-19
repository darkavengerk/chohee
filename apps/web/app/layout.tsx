import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ToastProvider } from '@chohee/ui';
import './globals.css';

// Cloudflare Pages는 Workers(v8 isolate) 위에서 동작 — Node.js API 사용 불가.
// 루트 layout에 선언하면 하위 모든 page segment에 상속됨.
export const runtime = 'edge';

export const metadata: Metadata = {
  title: '초희 — 가사가 음악이 되는 공간',
  description:
    'AI로 만든 음악과 가사를 공유하는 한국어 스트리밍 플랫폼. 가사를 음악의 부속물이 아닌 독립된 작품으로.',
  openGraph: {
    title: '초희 — 가사가 음악이 되는 공간',
    description: 'AI로 만든 음악과 가사를 공유하는 한국어 스트리밍 플랫폼.',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" data-accent="pine">
      <body className="min-h-screen bg-bg-0 text-fg-1 antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
