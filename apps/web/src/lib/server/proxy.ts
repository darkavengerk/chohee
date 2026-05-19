import type { Cookies } from '@sveltejs/kit';
import { COOKIE_NAMES } from '@chohee/shared';
import { env } from '$env/dynamic/private';

/**
 * SvelteKit /api/* endpoint에서 Workers API로 그대로 위임하는 헬퍼.
 * cookie의 access token을 Bearer로 변환. envelope은 그대로 client에 통과시킨다 (client 측
 * apiClientFetch가 envelope-aware).
 */
export async function proxyToApi(
  upstreamPath: string,
  init: {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: unknown;
    cookies: Cookies;
    fetch: typeof fetch;
  },
): Promise<Response> {
  const base = env.API_BASE_URL ?? 'http://localhost:8787';
  const accessToken = init.cookies.get(COOKIE_NAMES.ACCESS_TOKEN);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const upstream = await init.fetch(`${base.replace(/\/$/, '')}${upstreamPath}`, {
    method: init.method,
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}
