import { Hono } from 'hono';
import { and, desc, eq } from 'drizzle-orm';
import { createDb, schema } from '@chohee/db';
import { updateGenerationRequestSchema } from '@chohee/shared';
import type { AppBindings } from '../env';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { fail, notFound, ok } from '../lib/response';

const router = new Hono<AppBindings>();

router.get('/me/requests', requireAuth, async (c) => {
  const user = c.get('user')!;
  const db = createDb(c.env.DB);
  const rows = await db
    .select()
    .from(schema.musicGenerationRequests)
    .where(eq(schema.musicGenerationRequests.requestedByUserId, user.sub))
    .orderBy(desc(schema.musicGenerationRequests.requestedAt))
    .limit(100);
  return ok(c, {
    items: rows.map((r) => ({
      id: r.id,
      lyricsId: r.lyricsId,
      status: r.status,
      requestedAt: r.requestedAt,
      completedAt: r.completedAt,
      resultTrackId: r.resultTrackId,
      preferences: safeParseJson(r.preferences, {}),
    })),
  });
});

router.get('/admin/queue', requireAdmin, async (c) => {
  const db = createDb(c.env.DB);
  const status = c.req.query('status') ?? 'pending';
  const rows = await db
    .select()
    .from(schema.musicGenerationRequests)
    .where(eq(schema.musicGenerationRequests.status, status))
    .orderBy(desc(schema.musicGenerationRequests.requestedAt))
    .limit(50);
  return ok(c, {
    items: rows.map((r) => ({
      id: r.id,
      lyricsId: r.lyricsId,
      requestedByUserId: r.requestedByUserId,
      status: r.status,
      requestedAt: r.requestedAt,
      preferences: safeParseJson(r.preferences, {}),
      assignedToAdminId: r.assignedToAdminId,
      adminNotes: r.adminNotes,
    })),
  });
});

router.patch('/admin/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateGenerationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail(c, 'VALIDATION', '입력값이 올바르지 않습니다', { issues: parsed.error.flatten() });
  }
  const db = createDb(c.env.DB);
  const existing = await db
    .select()
    .from(schema.musicGenerationRequests)
    .where(eq(schema.musicGenerationRequests.id, id))
    .limit(1);
  if (!existing[0]) return notFound(c, '생성 요청');

  const update: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v !== undefined) update[k] = v;
  }
  if (parsed.data.status === 'completed') {
    update.completedAt = new Date().toISOString();
  }
  await db
    .update(schema.musicGenerationRequests)
    .set(update)
    .where(eq(schema.musicGenerationRequests.id, id));

  if (parsed.data.status) {
    await db
      .update(schema.lyrics)
      .set({
        generationRequestStatus: parsed.data.status,
        resultTrackId: parsed.data.resultTrackId ?? null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.lyrics.id, existing[0].lyricsId));
  }

  const after = await db
    .select()
    .from(schema.musicGenerationRequests)
    .where(eq(schema.musicGenerationRequests.id, id))
    .limit(1);
  return ok(c, after[0]);
});

function safeParseJson(s: string, fallback: unknown): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

export default router;
