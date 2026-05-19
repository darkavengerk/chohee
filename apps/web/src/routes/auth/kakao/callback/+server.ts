import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { forwardSetCookies } from '$lib/server/forward-cookies';

const SAFE_REDIRECT = /^\/[^/]/;

function extractNext(state: string | null): string {
  if (!state) return '/me';
  const m = state.match(/(?:^|\|)next=([^|]+)/);
  if (!m) return '/me';
  try {
    const decoded = decodeURIComponent(m[1]!);
    return SAFE_REDIRECT.test(decoded) ? decoded : '/me';
  } catch {
    return '/me';
  }
}

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const state = url.searchParams.get('state');
  const next = extractNext(state);

  if (error) {
    const reason = error === 'access_denied' ? 'kakao_denied' : 'kakao_failed';
    throw redirect(303, `/login?error=${reason}&next=${encodeURIComponent(next)}`);
  }
  if (!code) {
    throw redirect(303, `/login?error=missing_code&next=${encodeURIComponent(next)}`);
  }

  const base = env.API_BASE_URL ?? 'http://localhost:8787';
  const res = await fetch(`${base.replace(/\/$/, '')}/auth/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    throw redirect(303, `/login?error=kakao_failed&next=${encodeURIComponent(next)}`);
  }

  forwardSetCookies(res, cookies);
  throw redirect(303, next);
};
