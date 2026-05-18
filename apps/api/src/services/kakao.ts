import type { Env } from '../env';

export interface KakaoTokenResponse {
  access_token: string;
  token_type: 'bearer';
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
  scope?: string;
}

export interface KakaoProfile {
  id: number;
  kakao_account?: {
    email?: string;
    email_verified?: boolean;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
  };
}

const TOKEN_ENDPOINT = 'https://kauth.kakao.com/oauth/token';
const USER_ENDPOINT = 'https://kapi.kakao.com/v2/user/me';

export async function exchangeCodeForToken(
  env: Env,
  code: string,
): Promise<KakaoTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: env.KAKAO_CLIENT_ID,
    redirect_uri: env.KAKAO_REDIRECT_URI,
    code,
    ...(env.KAKAO_CLIENT_SECRET ? { client_secret: env.KAKAO_CLIENT_SECRET } : {}),
  });
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`kakao token exchange failed: ${res.status} ${text}`);
  }
  return (await res.json()) as KakaoTokenResponse;
}

export async function fetchKakaoProfile(accessToken: string): Promise<KakaoProfile> {
  const res = await fetch(USER_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`kakao profile fetch failed: ${res.status} ${text}`);
  }
  return (await res.json()) as KakaoProfile;
}

export function profileToDefaults(p: KakaoProfile): {
  email: string | null;
  nickname: string;
  avatarUrl: string | null;
  providerUserId: string;
} {
  return {
    email: p.kakao_account?.email ?? null,
    nickname: p.kakao_account?.profile?.nickname ?? '익명의 창작자',
    avatarUrl: p.kakao_account?.profile?.profile_image_url ?? null,
    providerUserId: String(p.id),
  };
}
