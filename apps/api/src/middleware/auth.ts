import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { COOKIE_NAMES } from '@chohee/shared';
import type { AppBindings } from '../env';
import { verifyAccessToken } from '../services/jwt';
import { unauthorized, forbidden } from '../lib/response';

export const attachUser: MiddlewareHandler<AppBindings> = async (c, next) => {
  const headerAuth = c.req.header('Authorization');
  const bearerToken = headerAuth?.startsWith('Bearer ') ? headerAuth.slice(7) : null;
  const cookieToken = getCookie(c, COOKIE_NAMES.ACCESS_TOKEN);
  const token = bearerToken ?? cookieToken;
  if (token) {
    const claims = await verifyAccessToken(token, c.env);
    if (claims) c.set('user', claims);
  }
  await next();
};

export const requireAuth: MiddlewareHandler<AppBindings> = async (c, next) => {
  if (!c.get('user')) return unauthorized(c);
  await next();
  return undefined;
};

export const requireAdmin: MiddlewareHandler<AppBindings> = async (c, next) => {
  const user = c.get('user');
  if (!user) return unauthorized(c);
  if (!user.isAdmin) return forbidden(c);
  await next();
  return undefined;
};
