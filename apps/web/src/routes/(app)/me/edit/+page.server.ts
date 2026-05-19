import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { updateMeSchema } from '@chohee/shared';
import { apiServerFetch } from '$lib/server/api';

interface MeResponse {
  id: string;
  handle: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  email: string | null;
  isAdmin: boolean;
  providers: string[];
  createdAt: string;
}

export const load: PageServerLoad = async ({ locals, fetch }) => {
  if (!locals.accessToken) throw error(401, '로그인이 필요합니다');
  const res = await apiServerFetch<MeResponse>('/me', { accessToken: locals.accessToken, fetch });
  if (!res.ok) throw error(res.status, res.error.message);
  return { me: res.data };
};

export const actions: Actions = {
  default: async ({ request, locals, fetch }) => {
    if (!locals.accessToken) return fail(401, { error: '로그인이 필요합니다' });
    const data = await request.formData();
    const raw = {
      handle: (data.get('handle') as string | null)?.trim() || undefined,
      displayName: (data.get('displayName') as string | null)?.trim() || undefined,
      bio: ((data.get('bio') as string | null) ?? '').trim() || null,
    };
    const parsed = updateMeSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        error: '입력값을 확인해주세요',
        issues: parsed.error.flatten().fieldErrors,
        values: raw,
      });
    }
    const res = await apiServerFetch('/me', {
      method: 'PATCH',
      body: parsed.data,
      accessToken: locals.accessToken,
      fetch,
    });
    if (!res.ok) {
      return fail(res.status, { error: res.error.message, values: raw });
    }
    throw redirect(303, '/me');
  },
};
