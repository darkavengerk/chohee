import { Hono } from 'hono';
import { and, desc, eq, lt } from 'drizzle-orm';
import { createDb, schema } from '@chohee/db';
import {
  createLyricsSchema,
  listQuerySchema,
  requestMusicSchema,
  updateLyricsSchema,
} from '@chohee/shared';
import type { AppBindings } from '../env';
import { requireAuth } from '../middleware/auth';
import { fail, forbidden, notFound, ok } from '../lib/response';
import { newId } from '../lib/id';
import { serializeLyrics } from '../lib/serialize';

const router = new Hono<AppBindings>();

router.get('/', async (c) => {
  const parsed = listQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return fail(c, 'VALIDATION', '쿼리가 잘못되었습니다');
  const { limit, cursor, userId } = parsed.data;
  const db = createDb(c.env.DB);
  const filters = [eq(schema.lyrics.status, 'published'), eq(schema.lyrics.isPublic, true)];
  if (userId) filters.push(eq(schema.lyrics.userId, userId));
  if (cursor) filters.push(lt(schema.lyrics.createdAt, cursor));
  const rows = await db
    .select()
    .from(schema.lyrics)
    .where(and(...filters))
    .orderBy(desc(schema.lyrics.createdAt))
    .limit(limit + 1);
  const slice = rows.slice(0, limit);
  const nextCursor = rows.length > limit ? slice[slice.length - 1]!.createdAt : null;
  return ok(c, { items: slice.map(serializeLyrics), nextCursor });
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.lyrics).where(eq(schema.lyrics.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '가사');
  return ok(c, serializeLyrics(row));
});

router.post('/', requireAuth, async (c) => {
  const user = c.get('user')!;
  const body = await c.req.json().catch(() => ({}));
  const parsed = createLyricsSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const db = createDb(c.env.DB);
  const id = newId();
  await db.insert(schema.lyrics).values({
    id,
    userId: user.sub,
    albumId: parsed.data.albumId ?? null,
    title: parsed.data.title,
    text: parsed.data.text,
    language: parsed.data.language,
    moodTags: JSON.stringify(parsed.data.moodTags),
    isPublic: parsed.data.isPublic,
    status: parsed.data.status,
  });
  const rows = await db.select().from(schema.lyrics).where(eq(schema.lyrics.id, id)).limit(1);
  return ok(c, serializeLyrics(rows[0]!), 201);
});

router.patch('/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.lyrics).where(eq(schema.lyrics.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '가사');
  if (row.userId !== user.sub && !user.isAdmin) return forbidden(c);
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateLyricsSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const update: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v === undefined) continue;
    if (k === 'moodTags') update[k] = JSON.stringify(v);
    else update[k] = v;
  }
  await db.update(schema.lyrics).set(update).where(eq(schema.lyrics.id, id));
  const after = await db.select().from(schema.lyrics).where(eq(schema.lyrics.id, id)).limit(1);
  return ok(c, serializeLyrics(after[0]!));
});

router.delete('/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.lyrics).where(eq(schema.lyrics.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '가사');
  if (row.userId !== user.sub && !user.isAdmin) return forbidden(c);
  await db.delete(schema.lyrics).where(eq(schema.lyrics.id, id));
  return ok(c, { id }, 200);
});

router.post('/:id/request-music', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.lyrics).where(eq(schema.lyrics.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '가사');
  if (row.userId !== user.sub) return forbidden(c);
  const body = await c.req.json().catch(() => ({}));
  const parsed = requestMusicSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const reqId = newId();
  await db.insert(schema.musicGenerationRequests).values({
    id: reqId,
    lyricsId: id,
    requestedByUserId: user.sub,
    preferences: JSON.stringify(parsed.data),
  });
  await db
    .update(schema.lyrics)
    .set({ generationRequestStatus: 'pending', updatedAt: new Date().toISOString() })
    .where(eq(schema.lyrics.id, id));
  return ok(c, { requestId: reqId, status: 'pending' }, 201);
});

export default router;
