import type { AuthClaims, Env } from '../env';

// HS256 JWT 구현. 외부 의존성 없이 Web Crypto만 사용 (Workers 호환).
// HS256으로 충분: 단일 서비스, 비밀키 회전은 secret 교체로 대응.

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const buf = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]!);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 2 ? '==' : input.length % 4 === 3 ? '=' : '';
  const s = atob(input.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signAccessToken(
  claims: Omit<AuthClaims, 'iat' | 'exp'>,
  env: Env,
): Promise<{ token: string; expiresAt: Date }> {
  const ttl = Number(env.JWT_ACCESS_TTL_SECONDS) || 3600;
  return signJwt(claims, env.JWT_SECRET, ttl);
}

export async function verifyAccessToken(token: string, env: Env): Promise<AuthClaims | null> {
  return verifyJwt(token, env.JWT_SECRET);
}

export interface RefreshTokenInfo {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

export async function issueRefreshToken(env: Env): Promise<RefreshTokenInfo> {
  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  const token = b64urlEncode(bytes);
  const tokenHash = await sha256Hex(token);
  const ttl = Number(env.JWT_REFRESH_TTL_SECONDS) || 60 * 60 * 24 * 30;
  const expiresAt = new Date(Date.now() + ttl * 1000);
  return { token, tokenHash, expiresAt };
}

export async function hashRefreshToken(token: string): Promise<string> {
  return sha256Hex(token);
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(input));
  const arr = Array.from(new Uint8Array(digest));
  return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function signJwt(
  payload: Record<string, unknown>,
  secret: string,
  ttlSeconds: number,
): Promise<{ token: string; expiresAt: Date }> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;
  const fullPayload = { ...payload, iat: now, exp };
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerSeg = b64urlEncode(enc.encode(JSON.stringify(header)));
  const payloadSeg = b64urlEncode(enc.encode(JSON.stringify(fullPayload)));
  const signingInput = `${headerSeg}.${payloadSeg}`;
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput));
  const sigSeg = b64urlEncode(sig);
  return { token: `${signingInput}.${sigSeg}`, expiresAt: new Date(exp * 1000) };
}

async function verifyJwt(token: string, secret: string): Promise<AuthClaims | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerSeg, payloadSeg, sigSeg] = parts as [string, string, string];
  const signingInput = `${headerSeg}.${payloadSeg}`;
  const key = await importKey(secret);
  const ok = await crypto.subtle.verify(
    'HMAC',
    key,
    b64urlDecode(sigSeg),
    enc.encode(signingInput),
  );
  if (!ok) return null;
  let payload: AuthClaims;
  try {
    payload = JSON.parse(dec.decode(b64urlDecode(payloadSeg))) as AuthClaims;
  } catch {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now) return null;
  return payload;
}
