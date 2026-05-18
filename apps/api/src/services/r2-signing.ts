import type { Env } from '../env';

// R2 (S3 호환) presigned PUT URL 생성. AWS Signature V4. 외부 SDK 없이 직접 서명.
// 참고: https://developers.cloudflare.com/r2/api/s3/api/

const enc = new TextEncoder();

async function hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data));
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function rfc3986(input: string): string {
  return encodeURIComponent(input).replace(/[!*'()]/g, (c) =>
    '%' + c.charCodeAt(0).toString(16).toUpperCase(),
  );
}

function timestamps(now = new Date()): { amzDate: string; dateStamp: string } {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = now.getUTCFullYear();
  const mm = pad(now.getUTCMonth() + 1);
  const dd = pad(now.getUTCDate());
  const hh = pad(now.getUTCHours());
  const mi = pad(now.getUTCMinutes());
  const ss = pad(now.getUTCSeconds());
  return {
    amzDate: `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`,
    dateStamp: `${yyyy}${mm}${dd}`,
  };
}

export interface PresignParams {
  env: Env;
  key: string;
  contentType: string;
  contentLength: number;
  expiresInSeconds?: number;
}

export interface PresignResult {
  url: string;
  method: 'PUT';
  headers: Record<string, string>;
  expiresAt: Date;
}

export async function presignR2PutUrl(params: PresignParams): Promise<PresignResult> {
  const {
    env,
    key,
    contentType,
    contentLength,
    expiresInSeconds = 3600,
  } = params;
  const region = 'auto';
  const service = 's3';
  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const bucket = env.R2_BUCKET_NAME;

  const { amzDate, dateStamp } = timestamps();
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const credential = `${env.R2_ACCESS_KEY_ID}/${credentialScope}`;

  // signed headers: host + content-length + content-type (R2 enforces declared sizes)
  const signedHeadersList = ['content-length', 'content-type', 'host'];
  const canonicalHeaders =
    `content-length:${contentLength}\n` +
    `content-type:${contentType}\n` +
    `host:${host}\n`;
  const signedHeaders = signedHeadersList.join(';');

  const query = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': credential,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresInSeconds),
    'X-Amz-SignedHeaders': signedHeaders,
  });
  // sorted by the URLSearchParams constructor input order — re-sort manually:
  const sorted = new URLSearchParams();
  Array.from(query.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .forEach(([k, v]) => sorted.append(k, v));

  const canonicalUri = `/${bucket}/${key
    .split('/')
    .map((p) => rfc3986(p))
    .join('/')}`;
  const canonicalQueryString = sorted.toString();

  const payloadHash = 'UNSIGNED-PAYLOAD';

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n');

  // derive signing key
  const kDate = await hmac(enc.encode(`AWS4${env.R2_SECRET_ACCESS_KEY}`), dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, 'aws4_request');
  const signature = toHex(await hmac(kSigning, stringToSign));

  sorted.append('X-Amz-Signature', signature);
  const url = `https://${host}${canonicalUri}?${sorted.toString()}`;

  return {
    url,
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(contentLength),
    },
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  };
}

// 다운로드용 presigned GET — 스트리밍 페이지에서 사용 (Phase 2)
export async function presignR2GetUrl(
  env: Env,
  key: string,
  expiresInSeconds = 3600,
): Promise<{ url: string; expiresAt: Date }> {
  const region = 'auto';
  const service = 's3';
  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const bucket = env.R2_BUCKET_NAME;
  const { amzDate, dateStamp } = timestamps();
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const credential = `${env.R2_ACCESS_KEY_ID}/${credentialScope}`;
  const signedHeaders = 'host';
  const canonicalHeaders = `host:${host}\n`;
  const sorted = new URLSearchParams();
  const pairs: ReadonlyArray<readonly [string, string]> = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Credential', credential],
    ['X-Amz-Date', amzDate],
    ['X-Amz-Expires', String(expiresInSeconds)],
    ['X-Amz-SignedHeaders', signedHeaders],
  ];
  for (const [k, v] of [...pairs].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    sorted.append(k, v);
  }
  const canonicalUri = `/${bucket}/${key
    .split('/')
    .map((p) => rfc3986(p))
    .join('/')}`;
  const canonicalRequest = [
    'GET',
    canonicalUri,
    sorted.toString(),
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n');
  const kDate = await hmac(enc.encode(`AWS4${env.R2_SECRET_ACCESS_KEY}`), dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, 'aws4_request');
  const signature = toHex(await hmac(kSigning, stringToSign));
  sorted.append('X-Amz-Signature', signature);
  return {
    url: `https://${host}${canonicalUri}?${sorted.toString()}`,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  };
}

export function buildObjectKey(
  scope: 'track' | 'cover' | 'waveform' | 'lyrics-attachment',
  userId: string,
  resourceId: string,
  filename: string,
): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const folder =
    scope === 'track'
      ? `tracks/${userId}/${resourceId}/audio`
      : scope === 'cover'
        ? `covers/${userId}/${resourceId}`
        : scope === 'waveform'
          ? `tracks/${userId}/${resourceId}/meta`
          : `lyrics/${userId}/${resourceId}`;
  const ts = Date.now().toString(36);
  return `${folder}/${ts}_${safe}`;
}
