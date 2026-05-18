import { Hono } from 'hono';
import { and, asc, desc, eq, inArray, lt } from 'drizzle-orm';
import { createDb, schema } from '@chohee/db';
import {
  createAlbumSchema,
  listQuerySchema,
  reorderAlbumItemsSchema,
  updateAlbumSchema,
} from '@chohee/shared';
import type { AppBindings } from '../env';
import { requireAuth } from '../middleware/auth';
import { fail, forbidden, notFound, ok } from '../lib/response';
import { newId } from '../lib/id';
import { serializeAlbum, serializeLyrics, serializeTrack } from '../lib/serialize';

const router = new Hono<AppBindings>();

router.get('/', async (c) => {
  const parsed = listQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return fail(c, 'VALIDATION', '쿼리가 잘못되었습니다');
  const { limit, cursor, userId } = parsed.data;
  const db = createDb(c.env.DB);
  const filters = [eq(schema.albums.status, 'published')];
  if (userId) filters.push(eq(schema.albums.userId, userId));
  if (cursor) filters.push(lt(schema.albums.createdAt, cursor));
  const rows = await db
    .select()
    .from(schema.albums)
    .where(and(...filters))
    .orderBy(desc(schema.albums.createdAt))
    .limit(limit + 1);
  const slice = rows.slice(0, limit);
  const nextCursor = rows.length > limit ? slice[slice.length - 1]!.createdAt : null;
  return ok(c, { items: slice.map(serializeAlbum), nextCursor });
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const albums = await db.select().from(schema.albums).where(eq(schema.albums.id, id)).limit(1);
  const album = albums[0];
  if (!album) return notFound(c, '앨범');

  const items = await db
    .select()
    .from(schema.albumItems)
    .where(eq(schema.albumItems.albumId, id))
    .orderBy(asc(schema.albumItems.position));

  const trackIds = items.filter((i) => i.itemType === 'track').map((i) => i.itemId);
  const lyricsIds = items.filter((i) => i.itemType === 'lyrics').map((i) => i.itemId);

  const tracksMap = new Map<string, ReturnType<typeof serializeTrack>>();
  if (trackIds.length) {
    const rows = await db.select().from(schema.tracks).where(inArray(schema.tracks.id, trackIds));
    for (const row of rows) tracksMap.set(row.id, serializeTrack(row));
  }

  const lyricsMap = new Map<string, ReturnType<typeof serializeLyrics>>();
  if (lyricsIds.length) {
    const rows = await db.select().from(schema.lyrics).where(inArray(schema.lyrics.id, lyricsIds));
    for (const row of rows) lyricsMap.set(row.id, serializeLyrics(row));
  }

  const enrichedItems = items.map((it) => ({
    itemType: it.itemType as 'track' | 'lyrics',
    itemId: it.itemId,
    position: it.position,
    track: it.itemType === 'track' ? tracksMap.get(it.itemId) ?? null : null,
    lyrics: it.itemType === 'lyrics' ? lyricsMap.get(it.itemId) ?? null : null,
  }));

  return ok(c, { album: serializeAlbum(album), items: enrichedItems });
});

router.post('/', requireAuth, async (c) => {
  const user = c.get('user')!;
  const body = await c.req.json().catch(() => ({}));
  const parsed = createAlbumSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const db = createDb(c.env.DB);
  const id = newId();
  await db.insert(schema.albums).values({
    id,
    userId: user.sub,
    title: parsed.data.title,
    conceptDescription: parsed.data.conceptDescription ?? null,
    moodTags: JSON.stringify(parsed.data.moodTags),
    coverArtKey: parsed.data.coverArtKey ?? null,
    status: parsed.data.status,
  });
  const rows = await db.select().from(schema.albums).where(eq(schema.albums.id, id)).limit(1);
  return ok(c, serializeAlbum(rows[0]!), 201);
});

router.patch('/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.albums).where(eq(schema.albums.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '앨범');
  if (row.userId !== user.sub && !user.isAdmin) return forbidden(c);
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateAlbumSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v === undefined) continue;
    if (k === 'moodTags') update[k] = JSON.stringify(v);
    else update[k] = v;
  }
  await db.update(schema.albums).set(update).where(eq(schema.albums.id, id));
  const after = await db.select().from(schema.albums).where(eq(schema.albums.id, id)).limit(1);
  return ok(c, serializeAlbum(after[0]!));
});

router.delete('/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const rows = await db.select().from(schema.albums).where(eq(schema.albums.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound(c, '앨범');
  if (row.userId !== user.sub && !user.isAdmin) return forbidden(c);
  await db.delete(schema.albums).where(eq(schema.albums.id, id));
  return ok(c, { id });
});

router.put('/:id/items', requireAuth, async (c) => {
  const user = c.get('user')!;
  const id = c.req.param('id');
  const db = createDb(c.env.DB);
  const albumRows = await db
    .select()
    .from(schema.albums)
    .where(eq(schema.albums.id, id))
    .limit(1);
  const album = albumRows[0];
  if (!album) return notFound(c, '앨범');
  if (album.userId !== user.sub && !user.isAdmin) return forbidden(c);
  const body = await c.req.json().catch(() => ({}));
  const parsed = reorderAlbumItemsSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }

  await db.delete(schema.albumItems).where(eq(schema.albumItems.albumId, id));
  if (parsed.data.items.length) {
    await db.insert(schema.albumItems).values(
      parsed.data.items.map((it) => ({
        albumId: id,
        itemType: it.itemType,
        itemId: it.itemId,
        position: it.position,
      })),
    );
  }
  await db
    .update(schema.albums)
    .set({ itemCount: parsed.data.items.length, updatedAt: new Date().toISOString() })
    .where(eq(schema.albums.id, id));

  return ok(c, { itemCount: parsed.data.items.length });
});

export default router;
