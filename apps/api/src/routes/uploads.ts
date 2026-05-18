import { Hono } from 'hono';
import { ACCEPTED_AUDIO_MIME, ACCEPTED_IMAGE_MIME, presignUploadSchema } from '@chohee/shared';
import type { AppBindings } from '../env';
import { requireAuth } from '../middleware/auth';
import { fail, ok } from '../lib/response';
import { buildObjectKey, presignR2PutUrl } from '../services/r2-signing';

const router = new Hono<AppBindings>();

router.post('/sign', requireAuth, async (c) => {
  const user = c.get('user')!;
  const body = await c.req.json().catch(() => ({}));
  const parsed = presignUploadSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const { kind, contentType, contentLength, scope, resourceId, filenameHint } = parsed.data;

  if (
    kind === 'audio' &&
    !(ACCEPTED_AUDIO_MIME as readonly string[]).includes(contentType)
  ) {
    return fail(c, 'VALIDATION', '오디오 형식이 지원되지 않습니다');
  }
  if (
    kind === 'image' &&
    !(ACCEPTED_IMAGE_MIME as readonly string[]).includes(contentType)
  ) {
    return fail(c, 'VALIDATION', '이미지 형식이 지원되지 않습니다');
  }

  const key = buildObjectKey(scope, user.sub, resourceId ?? crypto.randomUUID(), filenameHint ?? 'file');
  const presign = await presignR2PutUrl({
    env: c.env,
    key,
    contentType,
    contentLength,
    expiresInSeconds: 3600,
  });

  return ok(c, {
    key,
    url: presign.url,
    method: 'PUT' as const,
    headers: presign.headers,
    expiresAt: presign.expiresAt.toISOString(),
    maxBytes: contentLength,
  });
});

export default router;
