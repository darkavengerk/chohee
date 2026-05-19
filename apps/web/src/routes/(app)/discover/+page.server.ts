import type { PageServerLoad } from './$types';
import { apiServerFetch } from '$lib/server/api';

interface TrackItem {
  id: string;
  title: string;
  userId: string;
  durationMs: number | null;
  createdAt: string;
}

interface LyricsItem {
  id: string;
  title: string;
  userId: string;
  generationRequestStatus: string | null;
  createdAt: string;
}

interface ListEnvelope<T> {
  items: T[];
  nextCursor?: string | null;
}

export const load: PageServerLoad = async ({ fetch }) => {
  const [tracksRes, lyricsRes] = await Promise.all([
    apiServerFetch<ListEnvelope<TrackItem>>('/tracks?limit=12', { fetch }),
    apiServerFetch<ListEnvelope<LyricsItem>>('/lyrics?limit=12', { fetch }),
  ]);

  return {
    tracks: tracksRes.ok ? (tracksRes.data.items ?? []) : [],
    lyrics: lyricsRes.ok ? (lyricsRes.data.items ?? []) : [],
    tracksError: !tracksRes.ok ? tracksRes.error.message : null,
    lyricsError: !lyricsRes.ok ? lyricsRes.error.message : null,
  };
};
