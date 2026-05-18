import { Hono } from 'hono';
import { and, desc, eq, lt } from 'drizzle-orm';
import { createDb, schema } from '@chohee/db';
import {
  createTrackSchema,
  listQuerySchema,
  updateTrackSchema,
} from '@chohee/shared';
import type { AppBindings } from '../env';
import { requireAuth } from '../middleware/auth';
import { fail, forbidden, notFound, ok } from '../lib/response';
import { newId } from '../lib/id';
import { serializeTrack } from '../lib/serialize';

const router = new Hono<AppBindings>();

router.get('/', async (c) => {
  const parsed = listQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return fail(c, 'VALIDATION', '쿼리가 잘못되었습니다');
  const { limit, cursor, userId } = parsed.data;
  const db = createDb(c.env.DB);
  const filters = [eq(schema.tracks.status, 'published')];
  if (userId) filters.push(eq(schema.tracks.userId, userId));
  if (cursor) filters.push(lt(schema.tracks.createdAt, cursor));
  const rows = await db
    .select()
    .from(schema.tracks)
    .where(and(...filters))
    .orderBy(desc(schema.tracks.createdAt))
    .limit(limit + 1);
  const slice = rows.slice(0, limit);
  const nextCursor = rows.length > limit ? slice[slice.length - 1]!.createdAt : null;
  return ok(c, { items: slice.map(serializeTrack), nextCursor });
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.tracks).where(eq(schema.tracks.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '트랙');
  return ok(c, serializeTrack(row));
});

router.post('/', requireAuth, async (c) => {
  const user = c.get('user')!;
  const body = await c.req.json().catch(() => ({}));
  const parsed = createTrackSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const db = createDb(c.env.DB);
  const id = newId();
  await db.insert(schema.tracks).values({
    id,
    userId: user.sub,
    albumId: parsed.data.albumId ?? null,
    lyricsId: parsed.data.lyricsId ?? null,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    audioKeyPrefix: parsed.data.audioKeyPrefix,
    renditions: JSON.stringify(parsed.data.renditions),
    waveformKey: parsed.data.waveformKey ?? null,
    coverArtKey: parsed.data.coverArtKey ?? null,
    durationMs: parsed.data.durationMs,
    loudnessLufs: parsed.data.loudnessLufs ?? null,
    status: parsed.data.status,
    generatedBy: parsed.data.generatedBy,
    moodTags: JSON.stringify(parsed.data.moodTags),
    language: parsed.data.language,
  });
  const rows = await db.select().from(schema.tracks).where(eq(schema.tracks.id, id)).limit(1);
  return ok(c, serializeTrack(rows[0]!), 201);
});

router.patch('/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.tracks).where(eq(schema.tracks.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '트랙');
  if (row.userId !== user.sub && !user.isAdmin) return forbidden(c);
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateTrackSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const update: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v === undefined) continue;
    if (k === 'renditions' || k === 'moodTags') update[k] = JSON.stringify(v);
    else update[k] = v;
  }
  await db.update(schema.tracks).set(update).where(eq(schema.tracks.id, id));
  const after = await db.select().from(schema.tracks).where(eq(schema.tracks.id, id)).limit(1);
  return ok(c, serializeTrack(after[0]!));
});

router.delete('/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.tracks).where(eq(schema.tracks.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '트랙');
  if (row.userId !== user.sub && !user.isAdmin) return forbidden(c);
  await db.delete(schema.tracks).where(eq(schema.tracks.id, id));
  return ok(c, { id }, 200);
});

export default router;
