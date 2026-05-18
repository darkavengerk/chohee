export interface Env {
  // bindings
  DB: D1Database;
  BUCKET: R2Bucket;

  // vars
  WEB_ORIGIN: string;
  KAKAO_REDIRECT_URI: string;
  JWT_ACCESS_TTL_SECONDS: string;
  JWT_REFRESH_TTL_SECONDS: string;
  R2_BUCKET_NAME: string;

  // secrets
  KAKAO_CLIENT_ID: string;
  KAKAO_CLIENT_SECRET: string;
  JWT_SECRET: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;

  // 로컬 dev 전용. .dev.vars에서 "1"로 설정 시 /auth/dev-login 활성화. 운영에 절대 설정 금지.
  DEV_LOGIN_ENABLED?: string;
}

export interface AuthClaims {
  sub: string; // user id
  handle: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export interface AppVariables {
  user?: AuthClaims;
  requestId: string;
}

export type AppBindings = {
  Bindings: Env;
  Variables: AppVariables;
};
