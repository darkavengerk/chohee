import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { apiServerFetch } from '$lib/server/api';
import { forwardSetCookies } from '$lib/server/forward-cookies';

export const load: PageServerLoad = async ({ url, fetch }) => {
  const next = url.searchParams.get('next') ?? '/me';
  const errorCode = url.searchParams.get('error');

  const [urlRes, devRes] = await Promise.all([
    apiServerFetch<{ url: string; state: string }>('/auth/kakao/url', { fetch }),
    apiServerFetch<{ devLoginEnabled: boolean }>('/auth/dev-status', { fetch }),
  ]);

  return {
    next,
    errorCode,
    kakaoAuthorizeUrl: urlRes.ok ? urlRes.data.url : null,
    kakaoState: urlRes.ok ? urlRes.data.state : null,
    devLoginEnabled: devRes.ok ? devRes.data.devLoginEnabled : false,
  };
};

const SAFE_REDIRECT = /^\/[^/]/;

function pickNext(raw: FormDataEntryValue | null): string {
  const v = typeof raw === 'string' && SAFE_REDIRECT.test(raw) ? raw : '/me';
  return v;
}

export const actions: Actions = {
  devLogin: async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const handle = (data.get('handle') as string | null)?.trim() || 'dev_tester';
    const displayName = (data.get('displayName') as string | null)?.trim() || '개발 테스터';
    const isAdmin = data.get('isAdmin') === '1';
    const next = pickNext(data.get('next'));

    const base = env.API_BASE_URL ?? 'http://localhost:8787';
    const res = await fetch(`${base.replace(/\/$/, '')}/auth/dev-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ handle, displayName, isAdmin }),
    });

    if (!res.ok) {
      const text = await res.text();
      return fail(res.status, {
        error: `dev-login 실패 (${res.status}): ${text.slice(0, 200)}`,
      });
    }

    forwardSetCookies(res, cookies);
    throw redirect(303, next);
  },
};
