import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    handle: text('handle').notNull(),
    displayName: text('display_name').notNull(),
    email: text('email'),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
    updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    handleUniq: uniqueIndex('users_handle_uniq').on(t.handle),
    emailIdx: index('users_email_idx').on(t.email),
  }),
);

export const authProviders = sqliteTable(
  'auth_providers',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(), // 'kakao' | 'apple' | 'google'
    providerUserId: text('provider_user_id').notNull(),
    rawProfile: text('raw_profile'), // JSON string
    connectedAt: text('connected_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    providerUniq: uniqueIndex('auth_providers_provider_uniq').on(t.provider, t.providerUserId),
    userIdx: index('auth_providers_user_idx').on(t.userId),
  }),
);

export const refreshTokens = sqliteTable(
  'refresh_tokens',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: text('expires_at').notNull(),
    revokedAt: text('revoked_at'),
    userAgent: text('user_agent'),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
  },
  (t) => ({
    userIdx: index('refresh_tokens_user_idx').on(t.userId),
    tokenHashUniq: uniqueIndex('refresh_tokens_hash_uniq').on(t.tokenHash),
  }),
);
