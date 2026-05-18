import { z } from 'zod';
import {
  ACCEPTED_AUDIO_MIME,
  ACCEPTED_IMAGE_MIME,
  ALBUM_ITEM_TYPES,
  ALBUM_STATUS,
  BITRATES_KBPS,
  GENERATED_BY,
  GENERATION_REQUEST_STATUS,
  LANGUAGES,
  LYRICS_STATUS,
  TRACK_STATUS,
  UPLOAD_LIMITS,
} from '../constants';

export const handleSchema = z
  .string()
  .min(2)
  .max(24)
  .regex(/^[a-z0-9_]+$/, '소문자 영문, 숫자, 밑줄만 사용 가능합니다');

export const updateMeSchema = z.object({
  displayName: z.string().min(1).max(40).optional(),
  handle: handleSchema.optional(),
  bio: z.string().max(280).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});
export type UpdateMeInput = z.infer<typeof updateMeSchema>;

export const moodTagsSchema = z.array(z.string().min(1).max(20)).max(8);

export const audioRenditionSchema = z.object({
  bitrateKbps: z.union([z.literal(128), z.literal(192), z.literal(320)]),
  key: z.string().min(1),
  contentLength: z.number().int().positive(),
});

const _bitratesEnum = z.union(
  BITRATES_KBPS.map((b) => z.literal(b)) as unknown as [
    z.ZodLiteral<128>,
    z.ZodLiteral<192>,
    z.ZodLiteral<320>,
  ],
);

export const createTrackSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(2000).nullable().optional(),
  albumId: z.string().uuid().nullable().optional(),
  lyricsId: z.string().uuid().nullable().optional(),
  audioKeyPrefix: z.string().min(1),
  renditions: z.array(audioRenditionSchema).min(1),
  waveformKey: z.string().nullable().optional(),
  coverArtKey: z.string().nullable().optional(),
  durationMs: z.number().int().positive(),
  loudnessLufs: z.number().nullable().optional(),
  status: z.enum(TRACK_STATUS).default('draft'),
  generatedBy: z.enum(GENERATED_BY).default('human'),
  moodTags: moodTagsSchema.default([]),
  language: z.enum(LANGUAGES).default('ko'),
});
export type CreateTrackInput = z.infer<typeof createTrackSchema>;

export const updateTrackSchema = createTrackSchema.partial();
export type UpdateTrackInput = z.infer<typeof updateTrackSchema>;

export const createLyricsSchema = z.object({
  title: z.string().min(1).max(120),
  text: z.string().min(1).max(UPLOAD_LIMITS.LYRICS_MAX_LENGTH),
  language: z.enum(LANGUAGES).default('ko'),
  moodTags: moodTagsSchema.default([]),
  albumId: z.string().uuid().nullable().optional(),
  isPublic: z.boolean().default(true),
  status: z.enum(LYRICS_STATUS).default('published'),
});
export type CreateLyricsInput = z.infer<typeof createLyricsSchema>;

export const updateLyricsSchema = createLyricsSchema.partial();
export type UpdateLyricsInput = z.infer<typeof updateLyricsSchema>;

export const createAlbumSchema = z.object({
  title: z.string().min(1).max(120),
  conceptDescription: z.string().max(2000).nullable().optional(),
  moodTags: moodTagsSchema.default([]),
  coverArtKey: z.string().nullable().optional(),
  status: z.enum(ALBUM_STATUS).default('draft'),
});
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;

export const updateAlbumSchema = createAlbumSchema.partial();
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;

export const albumItemSchema = z.object({
  itemType: z.enum(ALBUM_ITEM_TYPES),
  itemId: z.string().uuid(),
  position: z.number().int().min(0).max(999),
});

export const reorderAlbumItemsSchema = z.object({
  items: z.array(albumItemSchema).max(UPLOAD_LIMITS.ALBUM_MAX_ITEMS),
});
export type ReorderAlbumItemsInput = z.infer<typeof reorderAlbumItemsSchema>;

export const requestMusicSchema = z.object({
  genreHints: z.array(z.string().max(40)).max(8).optional(),
  moodHints: z.array(z.string().max(40)).max(8).optional(),
  referenceUrl: z.string().url().optional(),
  notes: z.string().max(1000).optional(),
});
export type RequestMusicInput = z.infer<typeof requestMusicSchema>;

export const updateGenerationRequestSchema = z.object({
  status: z.enum(GENERATION_REQUEST_STATUS),
  assignedToAdminId: z.string().uuid().nullable().optional(),
  resultTrackId: z.string().uuid().nullable().optional(),
  adminNotes: z.string().max(2000).nullable().optional(),
});
export type UpdateGenerationRequestInput = z.infer<typeof updateGenerationRequestSchema>;

export const presignUploadSchema = z.object({
  kind: z.enum(['audio', 'image']),
  contentType: z.string().refine((v) => {
    return (
      (ACCEPTED_AUDIO_MIME as readonly string[]).includes(v) ||
      (ACCEPTED_IMAGE_MIME as readonly string[]).includes(v)
    );
  }, '지원하지 않는 파일 형식'),
  contentLength: z.number().int().positive().max(UPLOAD_LIMITS.AUDIO_MAX_BYTES),
  scope: z.enum(['track', 'cover', 'waveform', 'lyrics-attachment']),
  resourceId: z.string().optional(),
  filenameHint: z.string().max(120).optional(),
});
export type PresignUploadInput = z.infer<typeof presignUploadSchema>;

export const kakaoCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().optional(),
});
export type KakaoCallbackInput = z.infer<typeof kakaoCallbackSchema>;

export const listQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  q: z.string().max(80).optional(),
  userId: z.string().uuid().optional(),
});
export type ListQuery = z.infer<typeof listQuerySchema>;
