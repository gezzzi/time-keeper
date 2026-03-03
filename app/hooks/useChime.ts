"use client";
import { useRef, useCallback } from "react";

export function useChime() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playChime = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Westminster chime: E4 → C4 → D4 → G3
    const notes = [
      { freq: 329.63, start: 0.0, duration: 0.5 },
      { freq: 261.63, start: 0.5, duration: 0.5 },
      { freq: 293.66, start: 1.0, duration: 0.5 },
      { freq: 196.0, start: 1.5, duration: 0.8 },
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = freq;

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;

      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.value = freq * 3;

      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0, now + start);
      gain1.gain.linearRampToValueAtTime(0.3, now + start + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0, now + start);
      gain2.gain.linearRampToValueAtTime(0.1, now + start + 0.01);
      gain2.gain.exponentialRampToValueAtTime(
        0.001,
        now + start + duration * 0.7,
      );

      const gain3 = ctx.createGain();
      gain3.gain.setValueAtTime(0, now + start);
      gain3.gain.linearRampToValueAtTime(0.05, now + start + 0.005);
      gain3.gain.exponentialRampToValueAtTime(
        0.001,
        now + start + duration * 0.4,
      );

      osc1.connect(gain1).connect(ctx.destination);
      osc2.connect(gain2).connect(ctx.destination);
      osc3.connect(gain3).connect(ctx.destination);

      osc1.start(now + start);
      osc1.stop(now + start + duration);
      osc2.start(now + start);
      osc2.stop(now + start + duration);
      osc3.start(now + start);
      osc3.stop(now + start + duration * 0.4);
    });
  }, [getAudioContext]);

  return { playChime };
}
