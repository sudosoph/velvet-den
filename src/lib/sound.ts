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
  victoryFanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      playTone(f, 0.22, 'triangle', 0.08, idx * 0.08);
    });
  },
};
