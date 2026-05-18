import type {
  AlbumItemType,
  AlbumStatus,
  AuthProvider,
  BitrateKbps,
  GeneratedBy,
  GenerationRequestStatus,
  LanguageCode,
  LyricsStatus,
  TrackStatus,
} from '../constants';

export interface PublicUser {
  id: string;
  handle: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface CurrentUser extends PublicUser {
  email: string | null;
  isAdmin: boolean;
  providers: AuthProvider[];
}

export interface AudioRendition {
  bitrateKbps: BitrateKbps;
  key: string;
  contentLength: number;
}

export interface Track {
  id: string;
  userId: string;
  albumId: string | null;
  lyricsId: string | null;
  title: string;
  description: string | null;
  audioKeyPrefix: string;
  renditions: AudioRendition[];
  waveformKey: string | null;
  coverArtKey: string | null;
  durationMs: number;
  loudnessLufs: number | null;
  status: TrackStatus;
  generatedBy: GeneratedBy;
  moodTags: string[];
  language: LanguageCode;
  createdAt: string;
  updatedAt: string;
}

export interface Lyrics {
  id: string;
  userId: string;
  albumId: string | null;
  title: string;
  text: string;
  language: LanguageCode;
  moodTags: string[];
  generationRequestStatus: GenerationRequestStatus | null;
  resultTrackId: string | null;
  isPublic: boolean;
  status: LyricsStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  userId: string;
  title: string;
  conceptDescription: string | null;
  moodTags: string[];
  coverArtKey: string | null;
  status: AlbumStatus;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumItem {
  albumId: string;
  itemType: AlbumItemType;
  itemId: string;
  position: number;
}

export interface MusicGenerationRequest {
  id: string;
  lyricsId: string;
  requestedByUserId: string;
  status: GenerationRequestStatus;
  preferences: {
    genreHints?: string[];
    moodHints?: string[];
    referenceUrl?: string;
    notes?: string;
  };
  assignedToAdminId: string | null;
  resultTrackId: string | null;
  requestedAt: string;
  completedAt: string | null;
  adminNotes: string | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
}

export interface PresignedUploadUrl {
  url: string;
  method: 'PUT';
  key: string;
  headers: Record<string, string>;
  expiresAt: string;
  maxBytes: number;
}
