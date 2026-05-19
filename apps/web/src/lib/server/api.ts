import { env } from '$env/dynamic/private';

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
  accessToken?: string;
  fetch?: typeof fetch;
  headers?: Record<string, string>;
}

export async function apiServerFetch<T = unknown>(
  path: string,
  opts: FetchOptions = {},
): Promise<ApiResult<T>> {
  const base = env.API_BASE_URL ?? 'http://localhost:8787';
  const url = `${base.replace(/\/$/, '')}${path}`;
  const fetchImpl = opts.fetch ?? fetch;

  const headers: Record<string, string> = { Accept: 'application/json', ...opts.headers };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.accessToken) headers.Authorization = `Bearer ${opts.accessToken}`;

  let res: Response;
  try {
    res = await fetchImpl(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: { code: 'network_error', message: e instanceof Error ? e.message : 'network error' },
    };
  }

  const text = await res.text();
  const parsed = text ? safeJsonParse(text) : null;

  // API는 항상 envelope으로 응답: { ok: true, data: T } 또는 { ok: false, error: {...} }.
  // 여기서 envelope을 벗겨 호출자가 data만 다룰 수 있게 한다.
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

  return {
    ok: true,
    status: res.status,
    data: (envelope ? envelope.data : parsed) as T,
  };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
