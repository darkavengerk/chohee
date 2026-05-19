import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
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
  const res = await apiServerFetch<MeResponse>('/me', {
    accessToken: locals.accessToken,
    fetch,
  });
  if (!res.ok) throw error(res.status, res.error.message);
  return { me: res.data };
};
