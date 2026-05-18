import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { and, eq, isNull } from 'drizzle-orm';
import { createDb } from '@chohee/db';
import { schema } from '@chohee/db';
import { COOKIE_NAMES, kakaoCallbackSchema } from '@chohee/shared';
import type { AppBindings } from '../env';
import {
  exchangeCodeForToken,
  fetchKakaoProfile,
  profileToDefaults,
} from '../services/kakao';
import {
  hashRefreshToken,
  issueRefreshToken,
  signAccessToken,
} from '../services/jwt';
import { fail, ok, unauthorized } from '../lib/response';
import { newHandle, newId } from '../lib/id';

const router = new Hono<AppBindings>();

async function setAuthCookies(
  c: Parameters<typeof setCookie>[0],
  webOrigin: string,
  accessToken: string,
  accessExpiresAt: Date,
  refreshToken: string,
  refreshExpiresAt: Date,
): Promise<void> {
  const isHttps = webOrigin.startsWith('https://');
  const common = {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'Lax' as const,
    path: '/',
  };
  setCookie(c, COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...common,
    expires: accessExpiresAt,
  });
  setCookie(c, COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...common,
    expires: refreshExpiresAt,
  });
}

router.post('/kakao', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = kakaoCallbackSchema.safeParse(body);
  if (!parsed.success) return fail(c, 'VALIDATION', '카카오 인증 코드가 필요합니다');
  const { code } = parsed.data;

  const tokenRes = await exchangeCodeForToken(c.env, code);
  const profile = await fetchKakaoProfile(tokenRes.access_token);
  const defaults = profileToDefaults(profile);
  // access_token은 이 시점에서 폐기 — DB에 저장하지 않는다

  const db = createDb(c.env.DB);

  const existingProvider = await db
    .select()
    .from(schema.authProviders)
    .where(
      and(
        eq(schema.authProviders.provider, 'kakao'),
        eq(schema.authProviders.providerUserId, defaults.providerUserId),
      ),
    )
    .limit(1);

  let userId: string;
  let isAdmin = false;
  let handle: string;

  if (existingProvider.length > 0) {
    userId = existingProvider[0]!.userId;
    const users = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
    if (!users[0]) return fail(c, 'INTERNAL', '사용자 레코드를 찾을 수 없습니다');
    isAdmin = users[0].isAdmin;
    handle = users[0].handle;
  } else {
    userId = newId();
    handle = newHandle(defaults.nickname);
    await db.insert(schema.users).values({
      id: userId,
      handle,
      displayName: defaults.nickname,
      email: defaults.email,
      avatarUrl: defaults.avatarUrl,
    });
    await db.insert(schema.authProviders).values({
      id: newId(),
      userId,
      provider: 'kakao',
      providerUserId: defaults.providerUserId,
      rawProfile: JSON.stringify(profile),
    });
  }

  const access = await signAccessToken({ sub: userId, handle, isAdmin }, c.env);
  const refresh = await issueRefreshToken(c.env);
  await db.insert(schema.refreshTokens).values({
    id: newId(),
    userId,
    tokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt.toISOString(),
    userAgent: c.req.header('user-agent') ?? null,
  });

  await setAuthCookies(
    c,
    c.env.WEB_ORIGIN,
    access.token,
    access.expiresAt,
    refresh.token,
    refresh.expiresAt,
  );

  return ok(c, { userId, handle, isAdmin });
});

router.post('/refresh', async (c) => {
  const cookieRefresh = getCookie(c, COOKIE_NAMES.REFRESH_TOKEN);
  const refresh = cookieRefresh ?? (await c.req.json().catch(() => ({})))?.refreshToken;
  if (!refresh) return unauthorized(c);

  const tokenHash = await hashRefreshToken(refresh);
  const db = createDb(c.env.DB);
  const rows = await db
    .select()
    .from(schema.refreshTokens)
    .where(
      and(eq(schema.refreshTokens.tokenHash, tokenHash), isNull(schema.refreshTokens.revokedAt)),
    )
    .limit(1);
  const rt = rows[0];
  if (!rt) return unauthorized(c);
  if (new Date(rt.expiresAt).getTime() < Date.now()) return unauthorized(c);

  const userRow = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, rt.userId))
    .limit(1);
  const user = userRow[0];
  if (!user) return unauthorized(c);

  // 회전: 기존 토큰 폐기, 새 refresh 발급
  const newRefresh = await issueRefreshToken(c.env);
  await db
    .update(schema.refreshTokens)
    .set({ revokedAt: new Date().toISOString() })
    .where(eq(schema.refreshTokens.id, rt.id));
  await db.insert(schema.refreshTokens).values({
    id: newId(),
    userId: user.id,
    tokenHash: newRefresh.tokenHash,
    expiresAt: newRefresh.expiresAt.toISOString(),
    userAgent: c.req.header('user-agent') ?? null,
  });

  const access = await signAccessToken(
    { sub: user.id, handle: user.handle, isAdmin: user.isAdmin },
    c.env,
  );
  await setAuthCookies(
    c,
    c.env.WEB_ORIGIN,
    access.token,
    access.expiresAt,
    newRefresh.token,
    newRefresh.expiresAt,
  );
  return ok(c, { userId: user.id });
});

router.post('/logout', async (c) => {
  const cookieRefresh = getCookie(c, COOKIE_NAMES.REFRESH_TOKEN);
  if (cookieRefresh) {
    const tokenHash = await hashRefreshToken(cookieRefresh);
    const db = createDb(c.env.DB);
    await db
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date().toISOString() })
      .where(eq(schema.refreshTokens.tokenHash, tokenHash));
  }
  deleteCookie(c, COOKIE_NAMES.ACCESS_TOKEN, { path: '/' });
  deleteCookie(c, COOKIE_NAMES.REFRESH_TOKEN, { path: '/' });
  return ok(c, { ok: true });
});

router.get('/kakao/url', (c) => {
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: c.env.KAKAO_CLIENT_ID,
    redirect_uri: c.env.KAKAO_REDIRECT_URI,
    state,
    scope: 'profile_nickname profile_image account_email',
  });
  return ok(c, {
    url: `https://kauth.kakao.com/oauth/authorize?${params.toString()}`,
    state,
  });
});

export default router;
