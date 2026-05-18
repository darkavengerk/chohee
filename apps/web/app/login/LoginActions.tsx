'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, useToast } from '@chohee/ui';
import { apiFetch } from '@/lib/api-client';

interface KakaoAuthUrlResponse {
  url: string;
  state: string;
}

interface DevStatusResponse {
  devLoginEnabled: boolean;
}

interface DevLoginResponse {
  userId: string;
  handle: string;
  isAdmin: boolean;
}

export function LoginActions({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [devEnabled, setDevEnabled] = useState(false);
  const [devHandle, setDevHandle] = useState('dev_tester');
  const { show } = useToast();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    let cancelled = false;
    apiFetch<DevStatusResponse>('/auth/dev-status').then((res) => {
      if (cancelled) return;
      if (res.ok) setDevEnabled(res.data.devLoginEnabled);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function startKakaoLogin() {
    setLoading(true);
    const res = await apiFetch<KakaoAuthUrlResponse>('/auth/kakao/url');
    setLoading(false);
    if (!res.ok) {
      show({
        tone: 'danger',
        title: '로그인 URL을 가져오지 못했습니다',
        description: res.error.message,
      });
      return;
    }
    if (nextPath) {
      sessionStorage.setItem('chohee:next', nextPath);
    }
    window.location.href = res.data.url;
  }

  async function startDevLogin() {
    setDevLoading(true);
    const res = await apiFetch<DevLoginResponse>('/auth/dev-login', {
      method: 'POST',
      body: { handle: devHandle || 'dev_tester' },
    });
    setDevLoading(false);
    if (!res.ok) {
      show({
        tone: 'danger',
        title: '개발용 로그인 실패',
        description: res.error.message,
      });
      return;
    }
    show({ tone: 'success', title: `@${res.data.handle}로 로그인되었습니다` });
    router.refresh();
    router.push(nextPath || '/me');
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={startKakaoLogin}
        loading={loading}
        fullWidth
        size="lg"
        className="bg-[#FEE500] text-[#191919] hover:brightness-95"
      >
        카카오로 시작하기
      </Button>

      {devEnabled && (
        <div className="mt-2 flex flex-col gap-3 rounded-md border border-dashed border-bd-2 bg-bg-2 p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-pill border border-warn/30 bg-warn/10 px-2 py-0.5 text-[10.5px] font-medium text-warn">
              DEV ONLY
            </span>
            <span className="text-[12px] text-fg-3">카카오 없이 빠른 로그인</span>
          </div>
          <Input
            value={devHandle}
            onChange={(e) => setDevHandle(e.target.value)}
            placeholder="dev_tester"
            hint="이 핸들로 로그인합니다. 이미 있으면 그 사용자로, 없으면 새로 만듭니다."
          />
          <Button onClick={startDevLogin} loading={devLoading} variant="secondary" fullWidth>
            개발용 로그인
          </Button>
          <p className="text-[10.5px] leading-[1.6] text-fg-4">
            운영에서는 보이지 않습니다. apps/api/.dev.vars의 DEV_LOGIN_ENABLED=1 일 때만 활성.
          </p>
        </div>
      )}
    </div>
  );
}
