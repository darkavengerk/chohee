import type { ErrorHandler, NotFoundHandler } from 'hono';
import { ZodError } from 'zod';
import type { AppBindings } from '../env';
import { fail, notFound } from '../lib/response';

export const errorHandler: ErrorHandler<AppBindings> = (err, c) => {
  if (err instanceof ZodError) {
    return fail(c, 'VALIDATION', '요청이 올바르지 않습니다', { issues: err.flatten() });
  }
  console.error('[api] unhandled error', err);
  return fail(c, 'INTERNAL', '서버 오류가 발생했습니다');
};

export const notFoundHandler: NotFoundHandler<AppBindings> = (c) => {
  return notFound(c, '엔드포인트');
};
