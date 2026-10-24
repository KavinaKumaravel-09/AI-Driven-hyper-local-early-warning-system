import { SupportedLanguage } from '../types/weather';
import { SUPPORTED_LANGUAGES } from './translations';

let audioCtx: AudioContext | null = null;
let currentOscillator: OscillatorNode | null = null;
let currentGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a realistic Civil Defense Emergency Siren (frequency sweep 700Hz - 950Hz)
 */
export function playEmergencySiren(durationMs = 2000): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      stopAudioAlert(); // clear any previous sound

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';

      // Sweep frequency up and down like emergency wail
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(960, now + durationSec * 0.4);
      osc.frequency.linearRampToValueAtTime(700, now + durationSec * 0.8);
      osc.frequency.linearRampToValueAtTime(900, now + durationSec);

      // Volume envelope: smooth attack, sustain, fade out
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      gain.gain.setValueAtTime(0.18, now + durationSec - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      currentOscillator = osc;
      currentGainNode = gain;

      osc.start(now);
      osc.stop(now + durationSec);

      osc.onended = () => {
        if (currentOscillator === osc) {
          currentOscillator = null;
          currentGainNode = null;
        }
        resolve();
      };
    } catch {
      resolve();
    }
  });
}

/**
 * Plays a 2-tone pre-broadcast attention chime (523Hz -> 659Hz)
 */
export function playAttentionChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Tone 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.22); // E5
      gain2.gain.setValueAtTime(0.18, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.6);

      setTimeout(resolve, 600);
    } catch {
      resolve();
    }
  });
}

/**
 * Speaks text using Web Speech API with language-specific voice selection
 */
export function speakAlertText(
  text: string,
  lang: SupportedLanguage,
  rate = 0.95,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  const targetCode = langConfig?.speechCode || 'en-IN';
  utterance.lang = targetCode;

  // Try to find matching voice for target language
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === targetCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(lang.toLowerCase())
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    // If canceled, ignore
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

/**
 * Halts all speech and audio oscillators
 */
export function stopAudioAlert(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentOscillator) {
    try {
      currentOscillator.stop();
      currentOscillator.disconnect();
    } catch {
      // ignore
    }
    currentOscillator = null;
  }
}
