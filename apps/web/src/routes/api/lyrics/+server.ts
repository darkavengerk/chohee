import type { RequestHandler } from './$types';
import { proxyToApi } from '$lib/server/proxy';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
  const body = await request.json().catch(() => ({}));
  return proxyToApi('/lyrics', { method: 'POST', body, cookies, fetch });
};
