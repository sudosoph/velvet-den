/**
 * Zero-asset Web Audio API Lounge & Arcade Sound Synthesizer.
 * Gives every swipe, check-drop reflex hit, trail pace tap, message pop,
 * and red-flag buzz tactile game feel—with safe silent fallback in jsdom/SSR.
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
 * Dream Daddy-inspired warm Rhodes / Velvet Cocktail Lounge Major-9th ambient loop.
 * Pure WebAudio synthesis—zero external MP3 weight, instant toggle.
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
  venmoSwat() {
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
      const cleaned = text.replace(/[^\w\s.,?!'’"-]/g, '').slice(0, 220);
      const utter = new window.SpeechSynthesisUtterance(cleaned);
      const voices = typeof synth.getVoices === 'function' ? synth.getVoices() : [];
      if (voices.length > 0) {
        const preferred =
          style === 'her'
            ? voices.find((v) =>
                /Samantha|Ava|Victoria|Karen|Moira|Google US English|Female/i.test(v.name),
              )
            : voices.find((v) => /Daniel|Alex|Aaron|Fred|Google UK English Male|Male/i.test(v.name));
        if (preferred) utter.voice = preferred;
      }
      utter.pitch = style === 'her' ? 1.06 : style === 'trap_cub' ? 1.22 : 0.9;
      utter.rate = style === 'trap_cub' ? 1.15 : 0.97;
      utter.volume = 0.88;
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
