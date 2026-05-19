// 클라이언트 사이드 API 호출 — 같은 origin의 SvelteKit endpoint를 거친다.
// SvelteKit endpoint는 httpOnly 쿠키의 access token을 Bearer로 변환해 Workers API에 위임.
// 이렇게 하면 cross-origin 쿠키 문제를 피하고 client 번들에는 API_BASE_URL/secret이 노출되지 않는다.

export type ApiOk<T> = { ok: true; status: number; data: T };
export type ApiErr = {
  ok: false;
  status: number;
  error: { code: string; message: string; details?: unknown };
};
export type ApiResult<T> = ApiOk<T> | ApiErr;

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export async function apiClientFetch<T = unknown>(
  path: string,
  opts: FetchOptions = {},
): Promise<ApiResult<T>> {
  if (!path.startsWith('/')) path = `/${path}`;
  const url = `/api${path}`;

  const headers: Record<string, string> = { Accept: 'application/json', ...opts.headers };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      credentials: 'same-origin',
      signal: opts.signal,
    });
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: { code: 'network_error', message: e instanceof Error ? e.message : 'network error' },
    };
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  // SvelteKit proxy도 동일 envelope ({ok,data} / {ok,error}) 그대로 통과시킨다고 가정.
  const envelope =
    parsed && typeof parsed === 'object' && parsed !== null && 'ok' in parsed
      ? (parsed as { ok: boolean; data?: unknown; error?: { code?: string; message?: string; details?: unknown } })
      : null;

  if (!res.ok || (envelope && envelope.ok === false)) {
    const err = envelope?.error ?? null;
    return {
      ok: false,
      status: res.status,
      error: {
        code: err?.code ?? `http_${res.status}`,
        message: err?.message ?? `HTTP ${res.status}`,
        details: err?.details,
      },
    };
  }

  return { ok: true, status: res.status, data: (envelope ? envelope.data : parsed) as T };
}
