/**
 * 음원 파일에서 파형 데이터를 계산. 표시용 92 막대 + 저장용 1024 샘플을 만든다.
 * 오디오 디코딩은 Web Audio API의 OfflineAudioContext가 가장 간단하지만
 * 브라우저 호환을 위해 AudioContext.decodeAudioData 사용.
 */

export interface WaveformData {
  peaks: number[]; // 0..1
  duration: number; // seconds
}

export async function computeWaveform(file: Blob, bars = 1024): Promise<WaveformData> {
  const arrayBuffer = await file.arrayBuffer();
  const Ctx =
    (window.AudioContext as typeof AudioContext) ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  if (max > 0) {
    for (let i = 0; i < peaks.length; i++) peaks[i] = peaks[i]! / max;
  }
  return { peaks, duration: audioBuffer.duration };
}
