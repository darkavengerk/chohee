import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createAlbumSchema, MOOD_TAGS_PRESET } from '@chohee/shared';
import { apiServerFetch } from '$lib/server/api';

export const load = async () => {
  return { moodPreset: MOOD_TAGS_PRESET };
};

interface CreateAlbumResponse {
  id: string;
}

export const actions: Actions = {
  default: async ({ request, locals, fetch }) => {
    if (!locals.accessToken) return fail(401, { error: '로그인이 필요합니다' });
    const data = await request.formData();
    const moodTags = data.getAll('moodTags').map(String).filter(Boolean);
    const raw = {
      title: (data.get('title') as string)?.trim() ?? '',
      conceptDescription: ((data.get('conceptDescription') as string) ?? '').trim() || null,
      moodTags,
      status: ((data.get('status') as string) || 'draft') as 'draft' | 'published' | 'private',
    };
    const parsed = createAlbumSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        error: '입력값을 확인해주세요',
        issues: parsed.error.flatten().fieldErrors,
        values: raw,
      });
    }
    const res = await apiServerFetch<CreateAlbumResponse>('/albums', {
      method: 'POST',
      body: parsed.data,
      accessToken: locals.accessToken,
      fetch,
    });
    if (!res.ok) {
      return fail(res.status, { error: res.error.message, values: raw });
    }
    throw redirect(303, `/me`);
  },
};
