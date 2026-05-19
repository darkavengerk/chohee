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
    // account_email은 비즈니스 앱 등록을 요구하므로 기본 scope에서 제외.
    // 필요 시 비즈니스 등록 후 'account_email' 추가하고 동의항목 활성화.
    scope: 'profile_nickname profile_image',
  });
  return ok(c, {
    url: `https://kauth.kakao.com/oauth/authorize?${params.toString()}`,
    state,
  });
});

// ── 로컬 dev 전용 빠른 로그인 ──
// 카카오 없이 stub 사용자로 즉시 JWT 쿠키를 받기 위한 엔드포인트.
// env.DEV_LOGIN_ENABLED가 "1"일 때만 동작. 운영 환경에는 절대 활성화 금지.

router.get('/dev-status', (c) => {
  return ok(c, { devLoginEnabled: c.env.DEV_LOGIN_ENABLED === '1' });
});

router.post('/dev-login', async (c) => {
  if (c.env.DEV_LOGIN_ENABLED !== '1') {
    return fail(c, 'NOT_FOUND', '엔드포인트를 찾을 수 없습니다');
  }
  const body = (await c.req.json().catch(() => ({}))) as {
    handle?: string;
    displayName?: string;
    isAdmin?: boolean;
  };
  const rawHandle = (body.handle ?? 'dev_tester').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const handle = rawHandle.length >= 2 ? rawHandle.slice(0, 24) : 'dev_tester';
  const displayName = body.displayName?.slice(0, 40) || '개발 테스터';
  const isAdmin = Boolean(body.isAdmin);

  const db = createDb(c.env.DB);
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.handle, handle))
    .limit(1);

  let userId: string;
  let resolvedAdmin: boolean;
  let resolvedHandle: string;
  if (existing[0]) {
    userId = existing[0].id;
    resolvedAdmin = existing[0].isAdmin;
    resolvedHandle = existing[0].handle;
    if (isAdmin && !existing[0].isAdmin) {
      await db
        .update(schema.users)
        .set({ isAdmin: true, updatedAt: new Date().toISOString() })
        .where(eq(schema.users.id, userId));
      resolvedAdmin = true;
    }
  } else {
    userId = newId();
    resolvedAdmin = isAdmin;
    resolvedHandle = handle;
    await db.insert(schema.users).values({
      id: userId,
      handle,
      displayName,
      email: null,
      avatarUrl: null,
      isAdmin,
    });
    await db.insert(schema.authProviders).values({
      id: newId(),
      userId,
      provider: 'kakao',
      providerUserId: `dev:${handle}`,
      rawProfile: JSON.stringify({ dev: true }),
    });
  }

  const access = await signAccessToken(
    { sub: userId, handle: resolvedHandle, isAdmin: resolvedAdmin },
    c.env,
  );
  const refresh = await issueRefreshToken(c.env);
  await db.insert(schema.refreshTokens).values({
    id: newId(),
    userId,
    tokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt.toISOString(),
    userAgent: 'dev-login',
  });
  await setAuthCookies(
    c,
    c.env.WEB_ORIGIN,
    access.token,
    access.expiresAt,
    refresh.token,
    refresh.expiresAt,
  );
  return ok(c, { userId, handle: resolvedHandle, isAdmin: resolvedAdmin });
});

export default router;
