export const AUTH_PROVIDERS = ['kakao', 'apple', 'google'] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export const CONTENT_TYPES = ['track', 'lyrics', 'album'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const TRACK_STATUS = ['draft', 'published', 'private', 'taken_down'] as const;
export type TrackStatus = (typeof TRACK_STATUS)[number];

export const LYRICS_STATUS = ['draft', 'published', 'private'] as const;
export type LyricsStatus = (typeof LYRICS_STATUS)[number];

export const ALBUM_STATUS = ['draft', 'published', 'private'] as const;
export type AlbumStatus = (typeof ALBUM_STATUS)[number];

export const GENERATION_REQUEST_STATUS = [
  'pending',
  'in_progress',
  'completed',
  'rejected',
  'cancelled',
] as const;
export type GenerationRequestStatus = (typeof GENERATION_REQUEST_STATUS)[number];

export const GENERATED_BY = ['human', 'ai_assisted', 'ai_only'] as const;
export type GeneratedBy = (typeof GENERATED_BY)[number];

export const ALBUM_ITEM_TYPES = ['track', 'lyrics'] as const;
export type AlbumItemType = (typeof ALBUM_ITEM_TYPES)[number];

export const BITRATES_KBPS = [128, 192, 320] as const;
export type BitrateKbps = (typeof BITRATES_KBPS)[number];

export const UPLOAD_LIMITS = {
  AUDIO_MAX_BYTES: 200 * 1024 * 1024, // 200MB
  COVER_MAX_BYTES: 8 * 1024 * 1024, // 8MB
  LYRICS_MAX_LENGTH: 50_000,
  ALBUM_MAX_ITEMS: 100,
} as const;

export const ACCEPTED_AUDIO_MIME = [
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
  'audio/aac',
  'audio/flac',
  'audio/ogg',
] as const;

export const ACCEPTED_IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export const MOOD_TAGS_PRESET = [
  '잔잔한',
  '몽환적인',
  '따뜻한',
  '쓸쓸한',
  '경쾌한',
  '서정적인',
  '리드미컬한',
  '드라마틱한',
  '도시적인',
  '향수',
  '계절감',
  '밤',
] as const;

export const LANGUAGES = ['ko', 'en', 'ja', 'zh', 'other'] as const;
export type LanguageCode = (typeof LANGUAGES)[number];

export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT: 'RATE_LIMIT',
  INTERNAL: 'INTERNAL',
} as const;

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'chohee_at',
  REFRESH_TOKEN: 'chohee_rt',
} as const;
