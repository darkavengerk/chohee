import type { Album, Lyrics, Track, AudioRendition } from '@chohee/shared';

interface DbAlbum {
  id: string;
  userId: string;
  title: string;
  conceptDescription: string | null;
  moodTags: string;
  coverArtKey: string | null;
  status: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DbLyrics {
  id: string;
  userId: string;
  albumId: string | null;
  title: string;
  text: string;
  language: string;
  moodTags: string;
  generationRequestStatus: string | null;
  resultTrackId: string | null;
  isPublic: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DbTrack {
  id: string;
  userId: string;
  albumId: string | null;
  lyricsId: string | null;
  title: string;
  description: string | null;
  audioKeyPrefix: string;
  renditions: string;
  waveformKey: string | null;
  coverArtKey: string | null;
  durationMs: number;
  loudnessLufs: number | null;
  status: string;
  generatedBy: string;
  moodTags: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

function parseJsonArray(value: string): string[] {
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function parseRenditions(value: string): AudioRendition[] {
  try {
    const v = JSON.parse(value);
    if (!Array.isArray(v)) return [];
    return v as AudioRendition[];
  } catch {
    return [];
  }
}

export function serializeAlbum(row: DbAlbum): Album {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    conceptDescription: row.conceptDescription,
    moodTags: parseJsonArray(row.moodTags),
    coverArtKey: row.coverArtKey,
    status: row.status as Album['status'],
    itemCount: row.itemCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function serializeLyrics(row: DbLyrics): Lyrics {
  return {
    id: row.id,
    userId: row.userId,
    albumId: row.albumId,
    title: row.title,
    text: row.text,
    language: row.language as Lyrics['language'],
    moodTags: parseJsonArray(row.moodTags),
    generationRequestStatus: row.generationRequestStatus as Lyrics['generationRequestStatus'],
    resultTrackId: row.resultTrackId,
    isPublic: row.isPublic,
    status: row.status as Lyrics['status'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function serializeTrack(row: DbTrack): Track {
  return {
    id: row.id,
    userId: row.userId,
    albumId: row.albumId,
    lyricsId: row.lyricsId,
    title: row.title,
    description: row.description,
    audioKeyPrefix: row.audioKeyPrefix,
    renditions: parseRenditions(row.renditions),
    waveformKey: row.waveformKey,
    coverArtKey: row.coverArtKey,
    durationMs: row.durationMs,
    loudnessLufs: row.loudnessLufs,
    status: row.status as Track['status'],
    generatedBy: row.generatedBy as Track['generatedBy'],
    moodTags: parseJsonArray(row.moodTags),
    language: row.language as Track['language'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
