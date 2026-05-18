import { cors } from 'hono/cors';
import type { MiddlewareHandler } from 'hono';
import type { AppBindings } from '../env';

export function chohaeCors(): MiddlewareHandler<AppBindings> {
  return cors({
    origin: (origin, c) => {
      const allowed = c.env.WEB_ORIGIN;
      if (!origin) return allowed;
      if (origin === allowed) return origin;
      // 로컬 개발 시 추가 origin 허용 필요하면 여기에
      return null;
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  });
}
