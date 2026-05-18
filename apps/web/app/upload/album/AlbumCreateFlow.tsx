'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Chip,
  Input,
  StatusBadge,
  Textarea,
  useToast,
  type MusicGenerationStatus,
} from '@chohee/ui';
import { MOOD_TAGS_PRESET, type Lyrics, type Track } from '@chohee/shared';
import { apiFetch } from '@/lib/api-client';

interface SelectedItem {
  type: 'track' | 'lyrics';
  id: string;
  title: string;
}

export function AlbumCreateFlow({
  myTracks,
  myLyrics,
}: {
  myTracks: Track[];
  myLyrics: Lyrics[];
}) {
  const router = useRouter();
  const { show } = useToast();
  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [saving, setSaving] = useState(false);

  function addItem(type: 'track' | 'lyrics', id: string, name: string) {
    if (items.some((it) => it.type === type && it.id === id)) return;
    setItems((prev) => [...prev, { type, id, title: name }]);
  }
  function removeAt(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target]!, next[idx]!];
      return next;
    });
  }

  async function onSubmit() {
    if (!title.trim()) {
      show({ tone: 'warn', title: '앨범 제목을 입력해주세요' });
      return;
    }
    setSaving(true);
    const created = await apiFetch<{ id: string }>('/albums', {
      method: 'POST',
      body: {
        title,
        conceptDescription: concept || null,
        moodTags,
        status: 'published',
      },
    });
    if (!created.ok) {
      setSaving(false);
      show({ tone: 'danger', title: '앨범 생성 실패', description: created.error.message });
      return;
    }
    if (items.length) {
      const reorder = await apiFetch(`/albums/${created.data.id}/items`, {
        method: 'PUT',
        body: {
          items: items.map((it, idx) => ({ itemType: it.type, itemId: it.id, position: idx })),
        },
      });
      if (!reorder.ok) {
        show({
          tone: 'warn',
          title: '앨범은 생성됐지만 항목 배치에 실패했습니다',
          description: reorder.error.message,
        });
      }
    }
    setSaving(false);
    show({ tone: 'success', title: '앨범이 만들어졌습니다' });
    router.push('/me');
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section className="flex flex-col gap-5 rounded-lg border border-bd-1 bg-bg-1 p-6">
        <Input
          label="앨범 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="예: 정거장 가까이"
          required
        />
        <Textarea
          label="컨셉 설명"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          maxLength={2000}
          placeholder="이 앨범의 호흡, 무드, 듣기 좋은 시간 등"
        />
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-fg-2">무드 태그</span>
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
        <div className="border-t border-bd-1 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[14px] font-medium text-fg-1">앨범 항목</p>
            <p className="text-[11.5px] text-fg-4">{items.length}개</p>
          </div>
          {items.length === 0 ? (
            <p className="rounded-lg border border-dashed border-bd-2 px-4 py-6 text-center text-[12.5px] text-fg-3">
              오른쪽에서 곡이나 가사를 골라 담아주세요.
            </p>
          ) : (
            <ol className="flex flex-col gap-2">
              {items.map((it, idx) => (
                <li
                  key={`${it.type}-${it.id}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-bd-1 bg-bg-2 px-3 py-2"
                >
                  <span className="mono w-6 text-right text-[11px] text-fg-4">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="flex-1 truncate text-[13px] text-fg-1">{it.title}</span>
                  <span className="text-[11px] text-fg-3">
                    {it.type === 'track' ? '곡' : '가사'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      className="rounded-md px-2 py-0.5 text-fg-3 hover:text-fg-1"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, +1)}
                      className="rounded-md px-2 py-0.5 text-fg-3 hover:text-fg-1"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAt(idx)}
                      className="rounded-md px-2 py-0.5 text-danger hover:bg-danger/10"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={() => router.push('/me')}>
            취소
          </Button>
          <Button onClick={onSubmit} loading={saving}>
            앨범 생성
          </Button>
        </div>
      </section>

      <aside className="flex flex-col gap-4 rounded-lg border border-bd-1 bg-bg-1 p-6">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-fg-4">내 곡</p>
          {myTracks.length === 0 ? (
            <p className="mt-3 text-[12px] text-fg-3">아직 올린 곡이 없습니다.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-1">
              {myTracks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-bg-2"
                >
                  <span className="truncate text-[12.5px] text-fg-1">{t.title}</span>
                  <button
                    type="button"
                    className="rounded-md border border-bd-2 px-2 py-0.5 text-[10.5px] text-fg-2 hover:bg-bg-3"
                    onClick={() => addItem('track', t.id, t.title)}
                  >
                    + 담기
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-bd-1 pt-4">
          <p className="text-[11px] uppercase tracking-wider text-fg-4">내 가사</p>
          {myLyrics.length === 0 ? (
            <p className="mt-3 text-[12px] text-fg-3">아직 쓴 가사가 없습니다.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-1">
              {myLyrics.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-bg-2"
                >
                  <span className="flex flex-1 items-center gap-2 truncate text-[12.5px] text-fg-1">
                    {l.title}
                    {l.generationRequestStatus && (
                      <StatusBadge
                        status={l.generationRequestStatus as MusicGenerationStatus}
                      />
                    )}
                  </span>
                  <button
                    type="button"
                    className="rounded-md border border-bd-2 px-2 py-0.5 text-[10.5px] text-fg-2 hover:bg-bg-3"
                    onClick={() => addItem('lyrics', l.id, l.title)}
                  >
                    + 담기
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
