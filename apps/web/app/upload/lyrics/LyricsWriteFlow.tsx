'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Chip, Input, Lyrics, Textarea, useToast } from '@chohee/ui';
import { MOOD_TAGS_PRESET, UPLOAD_LIMITS } from '@chohee/shared';
import { apiFetch } from '@/lib/api-client';

export function LyricsWriteFlow() {
  const router = useRouter();
  const { show } = useToast();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [requestMusic, setRequestMusic] = useState(true);
  const [genreHint, setGenreHint] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const lines = text.split('\n').filter((l) => l.trim().length).length;
    const chars = text.length;
    return { lines, chars };
  }, [text]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      show({ tone: 'warn', title: '제목과 가사를 모두 작성해주세요' });
      return;
    }
    setSaving(true);
    const created = await apiFetch<{ id: string }>('/lyrics', {
      method: 'POST',
      body: {
        title,
        text,
        moodTags,
        language: 'ko',
        isPublic: true,
        status: 'published',
      },
    });
    if (!created.ok) {
      setSaving(false);
      show({ tone: 'danger', title: '저장 실패', description: created.error.message });
      return;
    }
    if (requestMusic) {
      const req = await apiFetch(`/lyrics/${created.data.id}/request-music`, {
        method: 'POST',
        body: {
          genreHints: genreHint ? [genreHint] : [],
          moodHints: moodTags,
          notes: notes || undefined,
        },
      });
      if (!req.ok) {
        show({
          tone: 'warn',
          title: '가사는 저장됐지만 음악 요청에 실패했습니다',
          description: req.error.message,
        });
      }
    }
    setSaving(false);
    show({ tone: 'success', title: '저장되었습니다' });
    router.push('/me');
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="flex flex-col gap-5 rounded-lg border border-bd-1 bg-bg-1 p-6">
        <Input
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="예: 겨울 우체국"
          required
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-fg-2">가사</span>
            <span className="mono text-[10.5px] text-fg-4">
              {stats.lines}줄 · {stats.chars}자 / {UPLOAD_LIMITS.LYRICS_MAX_LENGTH}
            </span>
          </div>
          <Textarea
            serif
            rows={18}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={UPLOAD_LIMITS.LYRICS_MAX_LENGTH}
            placeholder={'당신에게 부치지 못한 편지가\n책상 위에서 다시 잠이 든다.\n\n계절을 두 번 보내고도\n아직 우표를 사지 못한 채.'}
          />
          <p className="text-[11px] text-fg-4">
            빈 줄로 연을 나누고, 줄바꿈은 그대로 보존됩니다. 한글 자간/행간은 시집 호흡으로
            자동 적용됩니다.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-fg-2">무드 태그 (선택)</span>
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS_PRESET.map((tag) => (
              <Chip
                key={tag}
                active={moodTags.includes(tag)}
                onClick={() =>
                  setMoodTags((prev) =>
                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 8),
                  )
                }
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-5 rounded-lg border border-bd-1 bg-bg-1 p-6">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-fg-4">미리보기</p>
          {text ? (
            <Lyrics text={text} size="base" className="mt-3 max-h-[380px] overflow-auto" />
          ) : (
            <p className="mt-3 text-[12px] text-fg-3">가사를 작성하면 여기서 시집처럼 미리 봅니다.</p>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-bd-1 bg-bg-2 p-4">
          <label className="flex items-start gap-2 text-[13px] text-fg-1">
            <input
              type="checkbox"
              className="mt-1 accent-[var(--accent)]"
              checked={requestMusic}
              onChange={(e) => setRequestMusic(e.target.checked)}
            />
            <div>
              <span>이 가사에 음악 제안 받기</span>
              <p className="mt-1 text-[11.5px] text-fg-3">
                다른 사용자들이 이 가사에 음악을 입혀 제안할 수 있습니다. 마음에 드는 제안을
                채택하면 그 곡이 이 가사의 공식 음원이 됩니다. 새 제안이 도착하면 알림으로
                알려드려요.
              </p>
            </div>
          </label>
          {requestMusic && (
            <>
              <Input
                label="장르 힌트 (선택)"
                value={genreHint}
                onChange={(e) => setGenreHint(e.target.value)}
                placeholder="예: 어쿠스틱 발라드"
              />
              <Textarea
                label="요청 메모 (선택)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                placeholder="템포, 보컬 성별, 함께 듣고 싶은 곡 등"
              />
            </>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={() => router.push('/me')}>
            나중에 하기
          </Button>
          <Button type="submit" loading={saving}>
            저장
          </Button>
        </div>
      </aside>
    </form>
  );
}
