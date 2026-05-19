/**
 * 음원 파일에서 파형 데이터를 계산. 0..1로 정규화된 peaks 배열을 반환.
 * Web Audio API의 decodeAudioData 사용. iOS Safari는 webkitAudioContext fallback.
 */

export interface WaveformData {
  peaks: number[];
  duration: number;
}

export async function computeWaveform(file: Blob, bars = 1024): Promise<WaveformData> {
  const arrayBuffer = await file.arrayBuffer();
  const Ctx =
    (typeof AudioContext !== 'undefined' ? AudioContext : null) ??
    ((globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
      null);
  if (!Ctx) throw new Error('AudioContext가 지원되지 않습니다');
  const ctx = new Ctx();
  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    await ctx.close();
  }

  const channel = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channel.length / bars);
  const peaks: number[] = [];
  let max = 0;
  for (let i = 0; i < bars; i++) {
    const start = i * blockSize;
    let peak = 0;
    for (let j = 0; j < blockSize; j++) {
      const v = Math.abs(channel[start + j] ?? 0);
      if (v > peak) peak = v;
    }
    peaks.push(peak);
    if (peak > max) max = peak;
  }
  if (max > 0) for (let i = 0; i < peaks.length; i++) peaks[i] = peaks[i]! / max;
  return { peaks, duration: audioBuffer.duration };
}
