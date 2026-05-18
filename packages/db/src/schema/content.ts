import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const albums = sqliteTable(
  'albums',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    conceptDescription: text('concept_description'),
    moodTags: text('mood_tags').notNull().default('[]'), // JSON
    coverArtKey: text('cover_art_key'),
    status: text('status').notNull().default('draft'),
    itemCount: integer('item_count').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
    updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    userIdx: index('albums_user_idx').on(t.userId),
    statusIdx: index('albums_status_idx').on(t.status),
    createdIdx: index('albums_created_idx').on(t.createdAt),
  }),
);

export const lyrics = sqliteTable(
  'lyrics',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    albumId: text('album_id').references(() => albums.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    text: text('text').notNull(),
    language: text('language').notNull().default('ko'),
    moodTags: text('mood_tags').notNull().default('[]'),
    generationRequestStatus: text('generation_request_status'),
    resultTrackId: text('result_track_id'),
    isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(true),
    status: text('status').notNull().default('published'),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
    updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    userIdx: index('lyrics_user_idx').on(t.userId),
    albumIdx: index('lyrics_album_idx').on(t.albumId),
    statusIdx: index('lyrics_status_idx').on(t.status),
    createdIdx: index('lyrics_created_idx').on(t.createdAt),
    genIdx: index('lyrics_generation_idx').on(t.generationRequestStatus),
  }),
);

export const tracks = sqliteTable(
  'tracks',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    albumId: text('album_id').references(() => albums.id, { onDelete: 'set null' }),
    lyricsId: text('lyrics_id').references(() => lyrics.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    description: text('description'),
    audioKeyPrefix: text('audio_key_prefix').notNull(),
    renditions: text('renditions').notNull().default('[]'), // JSON array
    waveformKey: text('waveform_key'),
    coverArtKey: text('cover_art_key'),
    durationMs: integer('duration_ms').notNull(),
    loudnessLufs: integer('loudness_lufs'), // store as integer * 100 for precision; or nullable
    status: text('status').notNull().default('draft'),
    generatedBy: text('generated_by').notNull().default('human'),
    moodTags: text('mood_tags').notNull().default('[]'),
    language: text('language').notNull().default('ko'),
    playCount: integer('play_count').notNull().default(0),
    likeCount: integer('like_count').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
    updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    userIdx: index('tracks_user_idx').on(t.userId),
    albumIdx: index('tracks_album_idx').on(t.albumId),
    lyricsIdx: index('tracks_lyrics_idx').on(t.lyricsId),
    statusIdx: index('tracks_status_idx').on(t.status),
    createdIdx: index('tracks_created_idx').on(t.createdAt),
  }),
);

export const albumItems = sqliteTable(
  'album_items',
  {
    albumId: text('album_id')
      .notNull()
      .references(() => albums.id, { onDelete: 'cascade' }),
    itemType: text('item_type').notNull(), // 'track' | 'lyrics'
    itemId: text('item_id').notNull(),
    position: integer('position').notNull(),
    addedAt: text('added_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    albumPosIdx: index('album_items_album_pos_idx').on(t.albumId, t.position),
    itemIdx: index('album_items_item_idx').on(t.itemType, t.itemId),
  }),
);

export const musicGenerationRequests = sqliteTable(
  'music_generation_requests',
  {
    id: text('id').primaryKey(),
    lyricsId: text('lyrics_id')
      .notNull()
      .references(() => lyrics.id, { onDelete: 'cascade' }),
    requestedByUserId: text('requested_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('pending'),
    preferences: text('preferences').notNull().default('{}'), // JSON
    assignedToAdminId: text('assigned_to_admin_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    resultTrackId: text('result_track_id').references(() => tracks.id, { onDelete: 'set null' }),
    adminNotes: text('admin_notes'),
    requestedAt: text('requested_at').notNull().default(sql`(current_timestamp)`),
    completedAt: text('completed_at'),
  },
  (t) => ({
    statusIdx: index('mgr_status_idx').on(t.status),
    lyricsIdx: index('mgr_lyrics_idx').on(t.lyricsId),
    requesterIdx: index('mgr_requester_idx').on(t.requestedByUserId),
    assigneeIdx: index('mgr_assignee_idx').on(t.assignedToAdminId),
  }),
);

export const likes = sqliteTable(
  'likes',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    contentType: text('content_type').notNull(), // 'track' | 'lyrics' | 'album'
    contentId: text('content_id').notNull(),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    userContentIdx: index('likes_user_content_idx').on(t.userId, t.contentType, t.contentId),
    contentIdx: index('likes_content_idx').on(t.contentType, t.contentId),
  }),
);
