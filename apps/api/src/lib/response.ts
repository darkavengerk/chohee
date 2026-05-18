import type { Context } from 'hono';
import { API_ERROR_CODES } from '@chohee/shared';
import type { AppBindings } from '../env';

type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

const httpStatusForCode: Record<ApiErrorCode, 400 | 401 | 403 | 404 | 409 | 429 | 500> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 400,
  CONFLICT: 409,
  RATE_LIMIT: 429,
  INTERNAL: 500,
};

export function ok<T>(c: Context<AppBindings>, data: T, status: 200 | 201 = 200) {
  return c.json({ ok: true as const, data }, status);
}

export function fail(
  c: Context<AppBindings>,
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>,
) {
  return c.json(
    { ok: false as const, error: { code, message, ...(details ? { details } : {}) } },
    httpStatusForCode[code],
  );
}

export function notFound(c: Context<AppBindings>, what = '리소스') {
  return fail(c, 'NOT_FOUND', `${what}를 찾을 수 없습니다`);
}

export function unauthorized(c: Context<AppBindings>) {
  return fail(c, 'UNAUTHORIZED', '인증이 필요합니다');
}

export function forbidden(c: Context<AppBindings>) {
  return fail(c, 'FORBIDDEN', '권한이 없습니다');
}
