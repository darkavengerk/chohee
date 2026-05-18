import { env } from './env';
import type { ApiResult } from '@chohee/shared';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  baseUrl?: string;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const baseUrl = options.baseUrl ?? env.API_BASE_URL;
  const url = new URL(path, baseUrl);
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  const { body, query: _q, baseUrl: _b, headers: hdr, ...rest } = options;
  const init: RequestInit = {
    ...rest,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(hdr ?? {}),
    },
    credentials: 'include',
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(url.toString(), init);
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    return {
      ok: false,
      error: { code: 'INTERNAL', message: '응답을 읽을 수 없습니다' },
    };
  }
  return json as ApiResult<T>;
}

/**
 * Server Component에서 호출할 때 사용. cookies()에서 가져온 쿠키를 직접 헤더로 전달.
 */
export async function serverFetch<T>(
  path: string,
  options: RequestOptions & { cookieHeader?: string } = {},
): Promise<ApiResult<T>> {
  const { cookieHeader, ...rest } = options;
  return apiFetch<T>(path, {
    ...rest,
    headers: {
      ...(rest.headers ?? {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: 'no-store',
  });
}
