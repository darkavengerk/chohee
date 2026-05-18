import { cookies } from 'next/headers';
import { COOKIE_NAMES, type CurrentUser } from '@chohee/shared';
import { serverFetch } from './api-client';

export async function getCurrentUserFromServer(): Promise<CurrentUser | null> {
  const cookieStore = cookies();
  const at = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN);
  if (!at) return null;
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  const result = await serverFetch<CurrentUser>('/me', { cookieHeader });
  if (!result.ok) return null;
  return result.data;
}
