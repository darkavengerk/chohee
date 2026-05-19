import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { COOKIE_NAMES } from '@chohee/shared';

async function callLogout(refreshToken: string | undefined, fetchImpl: typeof fetch): Promise<void> {
  if (!refreshToken) return;
  const base = env.API_BASE_URL ?? 'http://localhost:8787';
  await fetchImpl(`${base.replace(/\/$/, '')}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => {
    // 로그아웃 실패는 사용자 경험을 막지 않는다. 쿠키만 지워도 보호 라우트 진입 불가.
  });
}

function clearAuthCookies(cookies: import('@sveltejs/kit').Cookies): void {
  cookies.delete(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' });
  cookies.delete(COOKIE_NAMES.REFRESH_TOKEN, { path: '/' });
}

export const POST: RequestHandler = async ({ cookies, fetch }) => {
  const refresh = cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
  await callLogout(refresh, fetch);
  clearAuthCookies(cookies);
  throw redirect(303, '/');
};

// GET도 허용 — 단순 링크로 로그아웃할 수 있게.
export const GET: RequestHandler = async ({ cookies, fetch }) => {
  const refresh = cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
  await callLogout(refresh, fetch);
  clearAuthCookies(cookies);
  throw redirect(303, '/');
};
