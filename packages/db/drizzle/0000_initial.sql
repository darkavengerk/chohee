-- Chohee 초기 스키마. drizzle-kit으로 동일하게 재생성 가능하지만 즉시 실행을 위해 손으로 작성.

CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `handle` text NOT NULL,
  `display_name` text NOT NULL,
  `email` text,
  `bio` text,
  `avatar_url` text,
  `is_admin` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT (current_timestamp) NOT NULL,
  `updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_handle_uniq` ON `users` (`handle`);
--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);
--> statement-breakpoint

CREATE TABLE `auth_providers` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `provider` text NOT NULL,
  `provider_user_id` text NOT NULL,
  `raw_profile` text,
  `connected_at` text DEFAULT (current_timestamp) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_providers_provider_uniq` ON `auth_providers` (`provider`, `provider_user_id`);
--> statement-breakpoint
CREATE INDEX `auth_providers_user_idx` ON `auth_providers` (`user_id`);
--> statement-breakpoint

CREATE TABLE `refresh_tokens` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `token_hash` text NOT NULL,
  `expires_at` text NOT NULL,
  `revoked_at` text,
  `user_agent` text,
  `created_at` text DEFAULT (current_timestamp) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_tokens_hash_uniq` ON `refresh_tokens` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `refresh_tokens_user_idx` ON `refresh_tokens` (`user_id`);
--> statement-breakpoint

CREATE TABLE `albums` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `title` text NOT NULL,
  `concept_description` text,
  `mood_tags` text DEFAULT '[]' NOT NULL,
  `cover_art_key` text,
  `status` text DEFAULT 'draft' NOT NULL,
  `item_count` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT (current_timestamp) NOT NULL,
  `updated_at` text DEFAULT (current_timestamp) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `albums_user_idx` ON `albums` (`user_id`);
--> statement-breakpoint
CREATE INDEX `albums_status_idx` ON `albums` (`status`);
--> statement-breakpoint
CREATE INDEX `albums_created_idx` ON `albums` (`created_at`);
--> statement-breakpoint

CREATE TABLE `lyrics` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `album_id` text,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `language` text DEFAULT 'ko' NOT NULL,
  `mood_tags` text DEFAULT '[]' NOT NULL,
  `generation_request_status` text,
  `result_track_id` text,
  `is_public` integer DEFAULT 1 NOT NULL,
  `status` text DEFAULT 'published' NOT NULL,
  `created_at` text DEFAULT (current_timestamp) NOT NULL,
  `updated_at` text DEFAULT (current_timestamp) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE INDEX `lyrics_user_idx` ON `lyrics` (`user_id`);
--> statement-breakpoint
CREATE INDEX `lyrics_album_idx` ON `lyrics` (`album_id`);
--> statement-breakpoint
CREATE INDEX `lyrics_status_idx` ON `lyrics` (`status`);
--> statement-breakpoint
CREATE INDEX `lyrics_created_idx` ON `lyrics` (`created_at`);
--> statement-breakpoint
CREATE INDEX `lyrics_generation_idx` ON `lyrics` (`generation_request_status`);
--> statement-breakpoint

CREATE TABLE `tracks` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `album_id` text,
  `lyrics_id` text,
  `title` text NOT NULL,
  `description` text,
  `audio_key_prefix` text NOT NULL,
  `renditions` text DEFAULT '[]' NOT NULL,
  `waveform_key` text,
  `cover_art_key` text,
  `duration_ms` integer NOT NULL,
  `loudness_lufs` integer,
  `status` text DEFAULT 'draft' NOT NULL,
  `generated_by` text DEFAULT 'human' NOT NULL,
  `mood_tags` text DEFAULT '[]' NOT NULL,
  `language` text DEFAULT 'ko' NOT NULL,
  `play_count` integer DEFAULT 0 NOT NULL,
  `like_count` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT (current_timestamp) NOT NULL,
  `updated_at` text DEFAULT (current_timestamp) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`lyrics_id`) REFERENCES `lyrics`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE INDEX `tracks_user_idx` ON `tracks` (`user_id`);
--> statement-breakpoint
CREATE INDEX `tracks_album_idx` ON `tracks` (`album_id`);
--> statement-breakpoint
CREATE INDEX `tracks_lyrics_idx` ON `tracks` (`lyrics_id`);
--> statement-breakpoint
CREATE INDEX `tracks_status_idx` ON `tracks` (`status`);
--> statement-breakpoint
CREATE INDEX `tracks_created_idx` ON `tracks` (`created_at`);
--> statement-breakpoint

CREATE TABLE `album_items` (
  `album_id` text NOT NULL,
  `item_type` text NOT NULL,
  `item_id` text NOT NULL,
  `position` integer NOT NULL,
  `added_at` text DEFAULT (current_timestamp) NOT NULL,
  FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `album_items_album_pos_idx` ON `album_items` (`album_id`, `position`);
--> statement-breakpoint
CREATE INDEX `album_items_item_idx` ON `album_items` (`item_type`, `item_id`);
--> statement-breakpoint

CREATE TABLE `music_generation_requests` (
  `id` text PRIMARY KEY NOT NULL,
  `lyrics_id` text NOT NULL,
  `requested_by_user_id` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `preferences` text DEFAULT '{}' NOT NULL,
  `assigned_to_admin_id` text,
  `result_track_id` text,
  `admin_notes` text,
  `requested_at` text DEFAULT (current_timestamp) NOT NULL,
  `completed_at` text,
  FOREIGN KEY (`lyrics_id`) REFERENCES `lyrics`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`requested_by_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`result_track_id`) REFERENCES `tracks`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE INDEX `mgr_status_idx` ON `music_generation_requests` (`status`);
--> statement-breakpoint
CREATE INDEX `mgr_lyrics_idx` ON `music_generation_requests` (`lyrics_id`);
--> statement-breakpoint
CREATE INDEX `mgr_requester_idx` ON `music_generation_requests` (`requested_by_user_id`);
--> statement-breakpoint
CREATE INDEX `mgr_assignee_idx` ON `music_generation_requests` (`assigned_to_admin_id`);
--> statement-breakpoint

CREATE TABLE `likes` (
  `user_id` text NOT NULL,
  `content_type` text NOT NULL,
  `content_id` text NOT NULL,
  `created_at` text DEFAULT (current_timestamp) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `likes_user_content_idx` ON `likes` (`user_id`, `content_type`, `content_id`);
--> statement-breakpoint
CREATE INDEX `likes_content_idx` ON `likes` (`content_type`, `content_id`);
