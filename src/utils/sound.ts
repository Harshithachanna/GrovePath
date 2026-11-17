// Web Audio API retro botanical chime synthesizer (zero external audio dependencies)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'triangle',
  gainPeak = 0.09
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainPeak, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playChime(
  kind: 'complete' | 'increment' | 'bloom' | 'undo' | 'pack',
  enabled: boolean
): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (kind === 'increment') {
    // Crisp marimba pip
    playTone(ctx, 523.25, now, 0.11, 'triangle', 0.07);
    playTone(ctx, 659.25, now + 0.06, 0.14, 'triangle', 0.06);
  } else if (kind === 'complete') {
    // Ascending pentatonic botanical chime: C5 - E5 - G5 - C6
    playTone(ctx, 523.25, now, 0.14, 'triangle', 0.08);
    playTone(ctx, 659.25, now + 0.07, 0.15, 'triangle', 0.08);
    playTone(ctx, 783.99, now + 0.14, 0.18, 'triangle', 0.085);
    playTone(ctx, 1046.5, now + 0.22, 0.28, 'sine', 0.09);
  } else if (kind === 'bloom') {
    // Sparkle chord when clicking / blooming a plot
    playTone(ctx, 659.25, now, 0.16, 'sine', 0.06);
    playTone(ctx, 880.0, now + 0.06, 0.18, 'triangle', 0.06);
    playTone(ctx, 1174.66, now + 0.12, 0.26, 'sine', 0.055);
  } else if (kind === 'undo') {
    // Gentle descending tap
    playTone(ctx, 440, now, 0.09, 'triangle', 0.05);
    playTone(ctx, 349.23, now + 0.05, 0.12, 'triangle', 0.045);
  } else if (kind === 'pack') {
    // Starter pack planting fanfare
    const notes = [392.0, 493.88, 587.33, 783.99, 987.77];
    notes.forEach((n, idx) => {
      playTone(ctx, n, now + idx * 0.07, 0.24, 'triangle', 0.075);
    });
  }
}
