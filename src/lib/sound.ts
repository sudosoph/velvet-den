/**
 * Zero-asset Web Audio API Lounge & Arcade Sound Synthesizer.
 * Gives every swipe, check-drop reflex hit, trail pace tap, message pop,
 * and red-flag buzz tactile game feel, with safe silent fallback in jsdom/SSR.
 */

let audioCtx: AudioContext | null = null;
let muted = false;
let bgmTimer: number | null = null;
let bgmStep = 0;

function getCtx(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!audioCtx) {
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function isSoundMuted(): boolean {
  return muted;
}

export function toggleSoundMute(): boolean {
  muted = !muted;
  if (muted && bgmTimer !== null && typeof window !== 'undefined') {
    window.clearInterval(bgmTimer);
    bgmTimer = null;
  }
  return muted;
}

export function isLoungeMusicPlaying(): boolean {
  return bgmTimer !== null;
}

/**
 * Warm electric-piano / cocktail lounge Major-9th ambient loop.
 * Pure WebAudio synthesis, zero external MP3 weight, instant toggle.
 */
export function toggleLoungeMusic(): boolean {
  if (typeof window === 'undefined') return false;
  if (bgmTimer !== null) {
    window.clearInterval(bgmTimer);
    bgmTimer = null;
    return false;
  }
  if (muted) {
    muted = false;
  }
  const chords: number[][] = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 392.0],  // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 246.94, 293.66, 392.0],  // G6
  ];
  const playChord = () => {
    if (muted) return;
    const chord = chords[bgmStep % chords.length];
    bgmStep += 1;
    chord.forEach((freq, i) => {
      playTone(freq, 1.85, 'sine', 0.022, i * 0.06);
    });
  };
  playChord();
  bgmTimer = window.setInterval(playChord, 2100);
  return true;
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.08,
  delaySec = 0,
  slideToFreq?: number,
) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideToFreq), start + durationSec);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationSec + 0.02);
  } catch {
    // Ignore audio context errors
  }
}

export const sfx = {
  swipeRight() {
    playTone(440, 0.12, 'triangle', 0.09, 0, 660);
    playTone(660, 0.16, 'sine', 0.08, 0.07, 880);
  },
  swipeLeft() {
    playTone(320, 0.14, 'sine', 0.07, 0, 150);
  },
  shockZoom() {
    playTone(190, 0.14, 'sawtooth', 0.09, 0, 140);
    playTone(145, 0.28, 'sawtooth', 0.1, 0.13, 98);
  },
  greenFlag() {
    // Warm cocktail lounge major-7th chime
    playTone(523.25, 0.18, 'triangle', 0.07, 0);
    playTone(659.25, 0.2, 'triangle', 0.07, 0.05);
    playTone(783.99, 0.22, 'triangle', 0.07, 0.1);
    playTone(987.77, 0.3, 'sine', 0.08, 0.15);
  },
  redFlag() {
    playTone(220, 0.16, 'sawtooth', 0.08, 0, 185);
    playTone(175, 0.26, 'sawtooth', 0.08, 0.14, 120);
  },
  messagePop() {
    playTone(580, 0.08, 'sine', 0.07, 0, 790);
  },
  paceTap() {
    playTone(360, 0.055, 'triangle', 0.06, 0, 420);
  },
  hotspotFix() {
    playTone(620, 0.09, 'triangle', 0.07, 0, 920);
  },
  sliderTick(ageValue = 28) {
    const mappedFreq = Math.max(240, Math.min(780, 220 + ageValue * 9));
    playTone(mappedFreq, 0.045, 'triangle', 0.055);
  },
  winePourGlug(fillPct = 50) {
    playTone(280 + fillPct * 3.2, 0.07, 'sine', 0.06, 0, 340 + fillPct * 3.5);
  },
  crystalClink() {
    playTone(1318.5, 0.22, 'sine', 0.075, 0);
    playTone(1760, 0.28, 'sine', 0.065, 0.035);
    playTone(2637, 0.18, 'triangle', 0.04, 0.06);
  },
  rhythmBeat(step = 0) {
    const scale = [523.25, 659.25, 783.99, 987.77];
    const f = scale[step % scale.length];
    playTone(f, 0.14, 'triangle', 0.075, 0, f * 1.06);
  },
  cardHoverTick() {
    playTone(480, 0.03, 'sine', 0.025);
  },
  redFlagSwat() {
    playTone(740, 0.07, 'triangle', 0.08, 0, 310);
    playTone(980, 0.09, 'sine', 0.06, 0.04, 1180);
  },
  victoryFanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      playTone(f, 0.22, 'triangle', 0.08, idx * 0.08);
    });
  },
  pixelStep(frame = 0) {
    playTone(frame % 2 === 0 ? 190 : 230, 0.03, 'square', 0.022);
  },
  pixelCoin() {
    playTone(987.77, 0.075, 'square', 0.055, 0);
    playTone(1318.51, 0.18, 'square', 0.06, 0.07);
  },
  pixelZap() {
    playTone(680, 0.08, 'square', 0.065, 0, 220);
    playTone(880, 0.12, 'square', 0.06, 0.06, 1240);
  },
  puppyBark() {
    playTone(540, 0.065, 'triangle', 0.07, 0, 760);
    playTone(620, 0.075, 'triangle', 0.07, 0.09, 860);
  },
  levelUp8Bit() {
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, idx) => {
      playTone(f, 0.14, 'square', 0.065, idx * 0.065);
    });
  },
};

export function playVoiceNotePreview(
  audioUrl: string,
  style: 'her' | 'green_cub' | 'trap_cub',
  onEnd?: () => void,
): () => void {
  if (muted || typeof window === 'undefined') {
    onEnd?.();
    return () => {};
  }

  let finished = false;
  let safetyTimer: number | null = null;
  let audioEl: HTMLAudioElement | null = null;

  const finishOnce = () => {
    if (finished) return;
    finished = true;
    if (safetyTimer !== null) window.clearTimeout(safetyTimer);
    onEnd?.();
  };

  // Subtle warm voice-memo tap click inside user gesture
  playTone(style === 'her' ? 540 : 440, 0.045, 'sine', 0.035);

  if (typeof window.Audio === 'function' && audioUrl) {
    try {
      audioEl = new window.Audio(audioUrl);
      audioEl.preload = 'auto';
      audioEl.volume = 0.96;
      audioEl.onended = () => finishOnce();
      audioEl.onerror = () => finishOnce();

      const playPromise = audioEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          finishOnce();
        });
      }

      safetyTimer = window.setTimeout(() => finishOnce(), 18000);

      return () => {
        finished = true;
        if (safetyTimer !== null) window.clearTimeout(safetyTimer);
        if (audioEl) {
          try {
            audioEl.onended = null;
            audioEl.onerror = null;
            audioEl.pause();
            audioEl.currentTime = 0;
          } catch {
            // Ignore media cleanup errors
          }
        }
      };
    } catch {
      finishOnce();
    }
  }

  finishOnce();
  return () => {
    finished = true;
    if (safetyTimer !== null) window.clearTimeout(safetyTimer);
  };
}
