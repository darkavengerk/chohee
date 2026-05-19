import type { Cookies } from '@sveltejs/kit';

interface ParsedCookie {
  name: string;
  value: string;
  options: {
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    expires?: Date;
    maxAge?: number;
    domain?: string;
  };
}

function parseSetCookie(header: string): ParsedCookie | null {
  const parts = header.split(';').map((p) => p.trim());
  const first = parts.shift();
  if (!first) return null;
  const eq = first.indexOf('=');
  if (eq < 0) return null;
  const name = first.slice(0, eq).trim();
  const value = decodeURIComponent(first.slice(eq + 1).trim());

  const options: ParsedCookie['options'] = {};
  for (const part of parts) {
    const [rawKey, ...rest] = part.split('=');
    const key = rawKey?.trim().toLowerCase();
    const val = rest.join('=').trim();
    if (!key) continue;
    switch (key) {
      case 'path':
        options.path = val || '/';
        break;
      case 'httponly':
        options.httpOnly = true;
        break;
      case 'secure':
        options.secure = true;
        break;
      case 'samesite':
        if (/^lax$/i.test(val)) options.sameSite = 'lax';
        else if (/^strict$/i.test(val)) options.sameSite = 'strict';
        else if (/^none$/i.test(val)) options.sameSite = 'none';
        break;
      case 'expires':
        if (val) {
          const d = new Date(val);
          if (!Number.isNaN(d.getTime())) options.expires = d;
        }
        break;
      case 'max-age':
        if (val) {
          const n = Number(val);
          if (Number.isFinite(n)) options.maxAge = n;
        }
        break;
      case 'domain':
        if (val) options.domain = val;
        break;
    }
  }
  return { name, value, options };
}

/**
 * API 응답의 Set-Cookie 헤더들을 SvelteKit 자체 origin의 쿠키로 재발행한다.
 * cross-origin 응답의 Set-Cookie는 브라우저에 직접 전달되지 않으므로 필요한 패턴.
 *
 * domain 옵션은 의도적으로 무시한다 (web의 자기 도메인에 한정). secure는 호출자가 결정하게
 * 강제 override하지 않는다.
 */
export function forwardSetCookies(response: Response, cookies: Cookies): void {
  const headers: string[] = [];
  if (typeof response.headers.getSetCookie === 'function') {
    headers.push(...response.headers.getSetCookie());
  } else {
    const raw = response.headers.get('set-cookie');
    if (raw) headers.push(raw);
  }

  for (const header of headers) {
    const parsed = parseSetCookie(header);
    if (!parsed) continue;
    const { name, value, options } = parsed;
    cookies.set(name, value, {
      path: options.path ?? '/',
      httpOnly: options.httpOnly ?? true,
      secure: options.secure ?? false,
      sameSite: options.sameSite ?? 'lax',
      ...(options.expires ? { expires: options.expires } : {}),
      ...(options.maxAge !== undefined ? { maxAge: options.maxAge } : {}),
    });
  }
}
