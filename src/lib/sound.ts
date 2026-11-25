/**
 * Zero-asset Web Audio API Lounge & Arcade Sound Synthesizer.
 * Gives every swipe, check-drop reflex hit, trail pace tap, message pop,
 * and red-flag buzz tactile game feel—with safe silent fallback in jsdom/SSR.
 */

let audioCtx: AudioContext | null = null;
let muted = false;

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
  return muted;
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
  victoryFanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      playTone(f, 0.22, 'triangle', 0.08, idx * 0.08);
    });
  },
};

export function playVoiceNotePreview(
  text: string,
  style: 'her' | 'green_cub' | 'trap_cub',
  onEnd?: () => void,
): () => void {
  if (muted || typeof window === 'undefined') {
    onEnd?.();
    return () => {};
  }

  // Play warm voice-note intro chime
  if (style === 'trap_cub') {
    playTone(340, 0.08, 'sawtooth', 0.05, 0, 250);
  } else {
    playTone(520, 0.09, 'triangle', 0.06, 0, 740);
  }

  let fallbackTimer: number | null = null;
  const synth = window.speechSynthesis;
  if (synth && typeof window.SpeechSynthesisUtterance === 'function') {
    try {
      synth.cancel();
      const cleaned = text.replace(/[^\w\s.,?!'’"-]/g, '').slice(0, 210);
      const utter = new window.SpeechSynthesisUtterance(cleaned);
      utter.pitch = style === 'her' ? 1.08 : style === 'trap_cub' ? 1.24 : 0.88;
      utter.rate = style === 'trap_cub' ? 1.18 : 0.98;
      utter.volume = 0.85;
      utter.onend = () => onEnd?.();
      utter.onerror = () => onEnd?.();
      synth.speak(utter);
      return () => {
        try {
          synth.cancel();
        } catch {
          // Ignore cancel errors
        }
      };
    } catch {
      // Fall through to melodic waveform cadence
    }
  }

  const notes =
    style === 'trap_cub'
      ? [330, 310, 350, 260, 220]
      : style === 'her'
        ? [440, 523.25, 587.33, 659.25, 523.25]
        : [293.66, 349.23, 440, 392, 440];
  notes.forEach((n, i) => playTone(n, 0.14, 'triangle', 0.055, i * 0.16));
  fallbackTimer = window.setTimeout(() => onEnd?.(), notes.length * 170 + 120);

  return () => {
    if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
  };
}
