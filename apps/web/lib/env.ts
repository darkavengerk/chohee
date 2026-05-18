export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8787',
  KAKAO_JS_KEY: process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? '',
  KAKAO_REDIRECT_URI:
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? 'http://localhost:3000/api/auth/kakao/callback',
  WEB_ORIGIN: process.env.NEXT_PUBLIC_WEB_ORIGIN ?? 'http://localhost:3000',
} as const;
