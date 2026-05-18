import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, schema } from '@chohee/db';
import type { AppBindings } from '../env';
import { notFound, ok } from '../lib/response';

const router = new Hono<AppBindings>();

router.get('/:handle', async (c) => {
  const handle = c.req.param('handle');
  const db = createDb(c.env.DB);
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.handle, handle))
    .limit(1);
  const user = rows[0];
  if (!user) return notFound(c, '사용자');
  return ok(c, {
    id: user.id,
    handle: user.handle,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  });
});

export default router;
