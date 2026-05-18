import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, schema } from '@chohee/db';
import { updateMeSchema } from '@chohee/shared';
import type { AppBindings } from '../env';
import { requireAuth } from '../middleware/auth';
import { fail, notFound, ok } from '../lib/response';

const router = new Hono<AppBindings>();
router.use('*', requireAuth);

router.get('/', async (c) => {
  const user = c.get('user')!;
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.users).where(eq(schema.users.id, user.sub)).limit(1);
  const me = rows[0];
  if (!me) return notFound(c, '사용자');
  const providers = await db
    .select({ provider: schema.authProviders.provider })
    .from(schema.authProviders)
    .where(eq(schema.authProviders.userId, user.sub));
  return ok(c, {
    id: me.id,
    handle: me.handle,
    displayName: me.displayName,
    bio: me.bio,
    avatarUrl: me.avatarUrl,
    email: me.email,
    isAdmin: me.isAdmin,
    providers: providers.map((p) => p.provider),
    createdAt: me.createdAt,
  });
});

router.patch('/', async (c) => {
  const user = c.get('user')!;
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateMeSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', {
      issues: parsed.error.flatten(),
    });
  }
  const db = createDb(c.env.DB);

  if (parsed.data.handle) {
    const dup = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.handle, parsed.data.handle))
      .limit(1);
    if (dup[0] && dup[0].id !== user.sub) {
      return fail(c, 'CONFLICT', '이미 사용 중인 핸들입니다');
    }
  }

  await db
    .update(schema.users)
    .set({
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.users.id, user.sub));

  const rows = await db.select().from(schema.users).where(eq(schema.users.id, user.sub)).limit(1);
  const me = rows[0]!;
  return ok(c, {
    id: me.id,
    handle: me.handle,
    displayName: me.displayName,
    bio: me.bio,
    avatarUrl: me.avatarUrl,
  });
});

export default router;
