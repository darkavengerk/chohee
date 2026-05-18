'use client';

import { useState } from 'react';
import { Button, useToast } from '@chohee/ui';
import { apiFetch } from '@/lib/api-client';

interface KakaoAuthUrlResponse {
  url: string;
  state: string;
}

export function LoginActions({ nextPath }: { nextPath?: string }) {
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  async function startKakaoLogin() {
    setLoading(true);
    const res = await apiFetch<KakaoAuthUrlResponse>('/auth/kakao/url');
    setLoading(false);
    if (!res.ok) {
      show({ tone: 'danger', title: '로그인 URL을 가져오지 못했습니다', description: res.error.message });
      return;
    }
    if (nextPath) {
      sessionStorage.setItem('chohee:next', nextPath);
    }
    window.location.href = res.data.url;
  }

  return (
    <Button
      onClick={startKakaoLogin}
      loading={loading}
      fullWidth
      size="lg"
      className="bg-[#FEE500] text-[#191919] hover:brightness-95"
    >
      카카오로 시작하기
    </Button>
  );
}
