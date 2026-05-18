'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input, Textarea, useToast } from '@chohee/ui';
import { apiFetch } from '@/lib/api-client';
import type { CurrentUser } from '@chohee/shared';

export function EditProfileForm({ me }: { me: CurrentUser }) {
  const router = useRouter();
  const { show } = useToast();
  const [displayName, setDisplayName] = useState(me.displayName);
  const [handle, setHandle] = useState(me.handle);
  const [bio, setBio] = useState(me.bio ?? '');
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await apiFetch('/me', {
      method: 'PATCH',
      body: { displayName, handle, bio: bio.length ? bio : null },
    });
    setSaving(false);
    if (!res.ok) {
      show({ tone: 'danger', title: '저장 실패', description: res.error.message });
      return;
    }
    show({ tone: 'success', title: '저장되었습니다' });
    router.refresh();
    router.push('/me');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Input
        label="표시 이름"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        maxLength={40}
        required
      />
      <Input
        label="핸들"
        value={handle}
        onChange={(e) => setHandle(e.target.value.toLowerCase())}
        hint="소문자 영문, 숫자, 밑줄(_)만 사용 가능. 2~24자."
        pattern="[a-z0-9_]{2,24}"
        required
      />
      <Textarea
        label="자기소개"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={280}
        hint={`${bio.length}/280`}
        placeholder="어떤 음악을 만들고 어떤 글을 쓰는지 짧게 소개해주세요."
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.push('/me')}>
          취소
        </Button>
        <Button type="submit" loading={saving}>
          저장
        </Button>
      </div>
    </form>
  );
}
