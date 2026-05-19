import type { PageServerLoad } from './$types';
import { MOOD_TAGS_PRESET, ACCEPTED_AUDIO_MIME, UPLOAD_LIMITS, BITRATES_KBPS } from '@chohee/shared';

export const load: PageServerLoad = async () => {
  return {
    moodPreset: MOOD_TAGS_PRESET,
    acceptedAudio: ACCEPTED_AUDIO_MIME,
    audioMaxBytes: UPLOAD_LIMITS.AUDIO_MAX_BYTES,
    bitrates: BITRATES_KBPS,
  };
};
