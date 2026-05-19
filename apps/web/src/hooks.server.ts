import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { apiServerFetch } from '$lib/server/api';

const PROTECTED = [/^\/me(\/|$)/, /^\/upload(\/|$)/, /^\/library(\/|$)/];
const AUTH_ONLY_REDIRECT_PATHS = [/^\/login$/];

const COOP_COEP_HEADERS: Record<string, string> = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-site',
};

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get('chohee_at');
  event.locals.accessToken = accessToken;

  if (accessToken) {
    const me = await apiServerFetch<App.Locals['user']>('/me', {
      accessToken,
      fetch: event.fetch,
    });
    if (me.ok) event.locals.user = me.data;
  }

  const path = event.url.pathname;
  if (!event.locals.user && PROTECTED.some((re) => re.test(path))) {
    throw redirect(303, `/login?next=${encodeURIComponent(path)}`);
  }
  if (event.locals.user && AUTH_ONLY_REDIRECT_PATHS.some((re) => re.test(path))) {
    throw redirect(303, '/');
  }

  const response = await resolve(event);
  for (const [k, v] of Object.entries(COOP_COEP_HEADERS)) response.headers.set(k, v);
  return response;
};
