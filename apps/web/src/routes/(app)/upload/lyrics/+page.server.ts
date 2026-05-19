import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createLyricsSchema, requestMusicSchema, MOOD_TAGS_PRESET } from '@chohee/shared';
import { apiServerFetch } from '$lib/server/api';

export const load = async () => {
  return { moodPreset: MOOD_TAGS_PRESET };
};

interface CreateLyricsResponse {
  id: string;
}

export const actions: Actions = {
  default: async ({ request, locals, fetch }) => {
    if (!locals.accessToken) return fail(401, { error: '로그인이 필요합니다' });
    const data = await request.formData();

    const moodTags = data.getAll('moodTags').map(String).filter(Boolean);
    const requestMusic = data.get('requestMusic') === 'on';
    const raw = {
      title: (data.get('title') as string)?.trim() ?? '',
      text: (data.get('text') as string)?.trim() ?? '',
      language: ((data.get('language') as string) || 'ko') as 'ko' | 'en' | 'ja' | 'zh' | 'other',
      moodTags,
      isPublic: data.get('isPublic') !== 'off',
    };

    const parsed = createLyricsSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        error: '입력값을 확인해주세요',
        issues: parsed.error.flatten().fieldErrors,
        values: raw,
        requestMusic,
      });
    }

    const created = await apiServerFetch<CreateLyricsResponse>('/lyrics', {
      method: 'POST',
      body: parsed.data,
      accessToken: locals.accessToken,
      fetch,
    });
    if (!created.ok) {
      return fail(created.status, { error: created.error.message, values: raw, requestMusic });
    }

    if (requestMusic) {
      const notes = ((data.get('notes') as string) ?? '').trim();
      const genreHints = (data.get('genreHints') as string)
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8);
      const reqBody = requestMusicSchema.safeParse({
        ...(genreHints && genreHints.length ? { genreHints } : {}),
        ...(notes ? { notes } : {}),
      });
      if (reqBody.success) {
        await apiServerFetch(`/lyrics/${created.data.id}/request-music`, {
          method: 'POST',
          body: reqBody.data,
          accessToken: locals.accessToken,
          fetch,
        });
      }
    }

    throw redirect(303, `/me`);
  },
};
