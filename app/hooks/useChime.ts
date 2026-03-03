"use client";
import { useRef, useCallback } from "react";

export type ChimeType =
  | "westminster"
  | "triple"
  | "marimba"
  | "wind-chime"
  | "harp"
  | "zen-bowl"
  | "aurora"
  | "rubber-duck"
  | "slide-whistle"
  | "kazoo"
  | "boing"
  | "ufo"
  | "cat-meow"
  | "robot"
  | "circus"
  | "bubble";

export const CHIME_LABELS: Record<ChimeType, string> = {
  westminster: "ウェストミンスター",
  triple: "トリプルチャイム",
  marimba: "マリンバ",
  "wind-chime": "風鈴",
  harp: "ハープ",
  "zen-bowl": "禅ボウル",
  aurora: "オーロラ",
  "rubber-duck": "アヒル",
  "slide-whistle": "スライドホイッスル",
  kazoo: "カズー",
  boing: "バネ",
  ufo: "UFO",
  "cat-meow": "ネコ",
  robot: "ロボット",
  circus: "サーカス",
  bubble: "バブル",
};

function playBellNote(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  volume: number = 0.3,
) {
  const now = ctx.currentTime;

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
  gain1.gain.linearRampToValueAtTime(volume, now + start + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now + start);
  gain2.gain.linearRampToValueAtTime(volume * 0.33, now + start + 0.01);
  gain2.gain.exponentialRampToValueAtTime(
    0.001,
    now + start + duration * 0.7,
  );

  const gain3 = ctx.createGain();
  gain3.gain.setValueAtTime(0, now + start);
  gain3.gain.linearRampToValueAtTime(volume * 0.17, now + start + 0.005);
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
}

function playWestminster(ctx: AudioContext) {
  playBellNote(ctx, 329.63, 0.0, 0.5);
  playBellNote(ctx, 261.63, 0.5, 0.5);
  playBellNote(ctx, 293.66, 1.0, 0.5);
  playBellNote(ctx, 196.0, 1.5, 0.8);
}

function playTriple(ctx: AudioContext) {
  playBellNote(ctx, 523.25, 0.0, 0.4, 0.2);
  playBellNote(ctx, 659.25, 0.35, 0.4, 0.25);
  playBellNote(ctx, 783.99, 0.7, 0.6, 0.3);
}

function playMarimba(ctx: AudioContext) {
  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, start: 0.0, dur: 0.3 },
    { freq: 392.0, start: 0.25, dur: 0.3 },
    { freq: 523.25, start: 0.5, dur: 0.3 },
    { freq: 659.25, start: 0.75, dur: 0.5 },
  ];

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.25, now + start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + start);
    gain2.gain.linearRampToValueAtTime(0.15, now + start + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + start + dur * 0.6);

    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur);
    osc2.start(now + start);
    osc2.stop(now + start + dur);
  });
}

function playWindChime(ctx: AudioContext) {
  // 風鈴: ランダムなタイミングで高音の金属音
  const now = ctx.currentTime;
  const frequencies = [1200, 1500, 1800, 2100, 1350, 1650];

  frequencies.forEach((freq, i) => {
    const start = i * 0.15 + Math.random() * 0.1;
    const dur = 0.8 + Math.random() * 0.4;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // 高次倍音で金属感
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.4;

    const gain = ctx.createGain();
    const vol = 0.08 + Math.random() * 0.06;
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(vol, now + start + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + start);
    gain2.gain.linearRampToValueAtTime(vol * 0.3, now + start + 0.002);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + start + dur * 0.5);

    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur);
    osc2.start(now + start);
    osc2.stop(now + start + dur);
  });
}

function playHarp(ctx: AudioContext) {
  // ハープのアルペジオ C-E-G-C-E (優しいグリッサンド)
  const now = ctx.currentTime;
  const notes = [
    { freq: 261.63, start: 0.0 },   // C4
    { freq: 329.63, start: 0.12 },  // E4
    { freq: 392.0, start: 0.24 },   // G4
    { freq: 523.25, start: 0.36 },  // C5
    { freq: 659.25, start: 0.48 },  // E5
  ];

  notes.forEach(({ freq, start }) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.15, now + start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + 1.5);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + start);
    gain2.gain.linearRampToValueAtTime(0.1, now + start + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + start + 1.8);

    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + 2.0);
    osc2.start(now + start);
    osc2.stop(now + start + 2.0);
  });
}

function playZenBowl(ctx: AudioContext) {
  // おりん風: 深い響きが長く持続
  const now = ctx.currentTime;
  const fundamental = 220; // A3

  // おりん特有の非整数倍音
  const partials = [
    { ratio: 1, vol: 0.2, decay: 4.0 },
    { ratio: 2.71, vol: 0.12, decay: 3.0 },
    { ratio: 5.04, vol: 0.06, decay: 2.0 },
    { ratio: 7.2, vol: 0.03, decay: 1.5 },
  ];

  partials.forEach(({ ratio, vol, decay }) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = fundamental * ratio;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + decay + 0.1);
  });

  // 微かなビート（2つの近い周波数の干渉）
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = fundamental;
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = fundamental + 1.5; // 1.5Hzのビート

  const beatGain = ctx.createGain();
  beatGain.gain.setValueAtTime(0, now);
  beatGain.gain.linearRampToValueAtTime(0.08, now + 0.01);
  beatGain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);

  osc1.connect(beatGain).connect(ctx.destination);
  osc2.connect(beatGain);

  osc1.start(now);
  osc1.stop(now + 4.5);
  osc2.start(now);
  osc2.stop(now + 4.5);
}

function playAurora(ctx: AudioContext) {
  // 幻想的なパッド音: ゆっくり立ち上がる和音
  const now = ctx.currentTime;
  const chordFreqs = [261.63, 329.63, 392.0, 493.88]; // Cmaj7

  chordFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // ゆっくりビブラート
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 3 + i * 0.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = freq * 0.005;
    lfo.connect(lfoGain).connect(osc.frequency);

    const gain = ctx.createGain();
    const delay = i * 0.3;
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.5);
    gain.gain.setValueAtTime(0.1, now + delay + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

    osc.connect(gain).connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + 4.0);
    lfo.start(now + delay);
    lfo.stop(now + 4.0);
  });
}

function playRubberDuck(ctx: AudioContext) {
  // アヒルの鳴き声: 矩形波で「クワッ クワッ」
  const now = ctx.currentTime;
  const quacks = [0.0, 0.25, 0.7];

  quacks.forEach((start) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, now + start);
    osc.frequency.linearRampToValueAtTime(400, now + start + 0.1);
    osc.frequency.setValueAtTime(400, now + start + 0.1);
    osc.frequency.linearRampToValueAtTime(600, now + start + 0.15);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.2, now + start + 0.01);
    gain.gain.setValueAtTime(0.2, now + start + 0.08);
    gain.gain.linearRampToValueAtTime(0, now + start + 0.18);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + 0.2);
  });
}

function playSlideWhistle(ctx: AudioContext) {
  // スライドホイッスル: 上がって下がる「ピューッ」
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
  osc.frequency.exponentialRampToValueAtTime(300, now + 1.2);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
  gain.gain.setValueAtTime(0.15, now + 0.5);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

  // 少しノイズを混ぜて息っぽく
  const bufferSize = ctx.sampleRate * 1.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 3000;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

  osc.connect(gain).connect(ctx.destination);
  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 1.4);
  noise.start(now);
  noise.stop(now + 1.4);
}

function playKazoo(ctx: AudioContext) {
  // カズー: ブーブー鳴るおもちゃの笛
  const now = ctx.currentTime;
  const melody = [
    { freq: 300, start: 0.0, dur: 0.2 },
    { freq: 350, start: 0.2, dur: 0.2 },
    { freq: 400, start: 0.4, dur: 0.15 },
    { freq: 350, start: 0.55, dur: 0.15 },
    { freq: 450, start: 0.7, dur: 0.4 },
  ];

  melody.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;

    // ビブラートでブルブル感
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 25;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = freq * 0.05;
    lfo.connect(lfoGain).connect(osc.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq * 2;
    filter.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.12, now + start + 0.02);
    gain.gain.setValueAtTime(0.12, now + start + dur * 0.8);
    gain.gain.linearRampToValueAtTime(0, now + start + dur);

    osc.connect(filter).connect(gain).connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
    lfo.start(now + start);
    lfo.stop(now + start + dur + 0.05);
  });
}

function playBoing(ctx: AudioContext) {
  // バネ: 漫画みたいなビョ〜ンビョ〜ン
  const now = ctx.currentTime;
  const bounces = [
    { start: 0.0, freqStart: 600, freqEnd: 80, dur: 0.35 },
    { start: 0.4, freqStart: 500, freqEnd: 100, dur: 0.3 },
    { start: 0.75, freqStart: 400, freqEnd: 120, dur: 0.25 },
  ];

  bounces.forEach(({ start, freqStart, freqEnd, dur }) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqStart, now + start);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + start + dur);

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freqStart * 1.5, now + start);
    osc2.frequency.exponentialRampToValueAtTime(freqEnd * 1.5, now + start + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.2, now + start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + start);
    gain2.gain.linearRampToValueAtTime(0.08, now + start + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + start + dur * 0.7);

    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
    osc2.start(now + start);
    osc2.stop(now + start + dur + 0.05);
  });
}

function playUfo(ctx: AudioContext) {
  // UFO: テルミン風のウニョウニョ
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.6);
  osc.frequency.exponentialRampToValueAtTime(1800, now + 0.9);
  osc.frequency.exponentialRampToValueAtTime(200, now + 1.4);

  // ビブラート
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 8;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 50;
  lfo.connect(lfoGain).connect(osc.frequency);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
  gain.gain.setValueAtTime(0.12, now + 1.0);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  // コーラス効果
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(305, now);
  osc2.frequency.exponentialRampToValueAtTime(1210, now + 0.3);
  osc2.frequency.exponentialRampToValueAtTime(405, now + 0.6);
  osc2.frequency.exponentialRampToValueAtTime(1810, now + 0.9);
  osc2.frequency.exponentialRampToValueAtTime(205, now + 1.4);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.08, now + 0.05);
  gain2.gain.setValueAtTime(0.08, now + 1.0);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  osc.connect(gain).connect(ctx.destination);
  osc2.connect(gain2).connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 1.6);
  osc2.start(now);
  osc2.stop(now + 1.6);
  lfo.start(now);
  lfo.stop(now + 1.6);
}

function playCatMeow(ctx: AudioContext) {
  // ネコ: 「ニャー ニャッ」
  const now = ctx.currentTime;
  const meows = [
    { start: 0.0, dur: 0.6 },
    { start: 0.8, dur: 0.25 },
  ];

  meows.forEach(({ start, dur }) => {
    // 母音フォルマント（ニャーの「ア」っぽさ）
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(480, now + start);
    osc.frequency.linearRampToValueAtTime(520, now + start + dur * 0.3);
    osc.frequency.linearRampToValueAtTime(400, now + start + dur);

    const filter1 = ctx.createBiquadFilter();
    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(800, now + start);
    filter1.frequency.linearRampToValueAtTime(1200, now + start + dur * 0.2);
    filter1.frequency.linearRampToValueAtTime(600, now + start + dur);
    filter1.Q.value = 5;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = "bandpass";
    filter2.frequency.value = 2500;
    filter2.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.15, now + start + 0.03);
    gain.gain.setValueAtTime(0.15, now + start + dur * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + start);
    gain2.gain.linearRampToValueAtTime(0.06, now + start + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + start + dur * 0.8);

    osc.connect(filter1).connect(gain).connect(ctx.destination);
    osc.connect(filter2).connect(gain2).connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });
}

function playRobot(ctx: AudioContext) {
  // ロボット: R2-D2風のピコピコ電子音
  const now = ctx.currentTime;
  const beeps = [
    { freq: 1800, start: 0.0, dur: 0.08 },
    { freq: 1200, start: 0.1, dur: 0.06 },
    { freq: 2200, start: 0.18, dur: 0.1 },
    { freq: 800, start: 0.3, dur: 0.05 },
    { freq: 1500, start: 0.37, dur: 0.12 },
    { freq: 2000, start: 0.52, dur: 0.06 },
    { freq: 900, start: 0.6, dur: 0.08 },
    { freq: 2400, start: 0.7, dur: 0.15 },
  ];

  beeps.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now + start);
    // ランダムにスイープ
    osc.frequency.linearRampToValueAtTime(
      freq * (0.8 + Math.random() * 0.4),
      now + start + dur,
    );

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 4000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.1, now + start + 0.005);
    gain.gain.setValueAtTime(0.1, now + start + dur * 0.8);
    gain.gain.linearRampToValueAtTime(0, now + start + dur);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.02);
  });
}

function playCircus(ctx: AudioContext) {
  // サーカス: カリオペ風の陽気なメロディ
  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, start: 0.0, dur: 0.12 },   // C5
    { freq: 587.33, start: 0.12, dur: 0.12 },   // D5
    { freq: 659.25, start: 0.24, dur: 0.12 },   // E5
    { freq: 698.46, start: 0.36, dur: 0.12 },   // F5
    { freq: 659.25, start: 0.48, dur: 0.12 },   // E5
    { freq: 523.25, start: 0.6, dur: 0.12 },    // C5
    { freq: 392.0, start: 0.72, dur: 0.25 },    // G4
    { freq: 523.25, start: 1.0, dur: 0.12 },    // C5
    { freq: 659.25, start: 1.12, dur: 0.12 },   // E5
    { freq: 783.99, start: 1.24, dur: 0.35 },   // G5
  ];

  notes.forEach(({ freq, start, dur }) => {
    // オルガン音色（矩形波＋鳴き）
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    osc2.type = "square";
    osc2.frequency.value = freq * 2;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = freq * 6;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.08, now + start + 0.01);
    gain.gain.setValueAtTime(0.08, now + start + dur * 0.7);
    gain.gain.linearRampToValueAtTime(0, now + start + dur);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + start);
    gain2.gain.linearRampToValueAtTime(0.03, now + start + 0.01);
    gain2.gain.linearRampToValueAtTime(0, now + start + dur);

    osc.connect(gain).connect(filter).connect(ctx.destination);
    osc2.connect(gain2).connect(filter);

    osc.start(now + start);
    osc.stop(now + start + dur + 0.02);
    osc2.start(now + start);
    osc2.stop(now + start + dur + 0.02);
  });
}

function playBubble(ctx: AudioContext) {
  // バブル: 水中のブクブク泡
  const now = ctx.currentTime;
  const bubbles = [
    { start: 0.0, freq: 150, dur: 0.15 },
    { start: 0.12, freq: 200, dur: 0.12 },
    { start: 0.2, freq: 120, dur: 0.18 },
    { start: 0.35, freq: 250, dur: 0.1 },
    { start: 0.4, freq: 180, dur: 0.14 },
    { start: 0.55, freq: 300, dur: 0.08 },
    { start: 0.6, freq: 140, dur: 0.2 },
    { start: 0.75, freq: 220, dur: 0.12 },
    { start: 0.85, freq: 160, dur: 0.15 },
    { start: 0.95, freq: 280, dur: 0.1 },
  ];

  bubbles.forEach(({ start, freq, dur }) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    // 泡が浮き上がって弾ける: 周波数が急上昇
    osc.frequency.setValueAtTime(freq, now + start);
    osc.frequency.exponentialRampToValueAtTime(freq * 4, now + start + dur * 0.8);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + start + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.12, now + start + 0.005);
    gain.gain.setValueAtTime(0.12, now + start + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

    // 水中感のフィルタ
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq * 3;
    filter.Q.value = 2;

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });

  // 水のアンビエントノイズ
  const bufferSize = ctx.sampleRate * 1.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 400;
  noiseFilter.Q.value = 1;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
  noiseGain.gain.setValueAtTime(0.04, now + 0.8);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 1.3);
}

const CHIME_PLAYERS: Record<ChimeType, (ctx: AudioContext) => void> = {
  westminster: playWestminster,
  triple: playTriple,
  marimba: playMarimba,
  "wind-chime": playWindChime,
  harp: playHarp,
  "zen-bowl": playZenBowl,
  aurora: playAurora,
  "rubber-duck": playRubberDuck,
  "slide-whistle": playSlideWhistle,
  kazoo: playKazoo,
  boing: playBoing,
  ufo: playUfo,
  "cat-meow": playCatMeow,
  robot: playRobot,
  circus: playCircus,
  bubble: playBubble,
};

export function useChime(chimeType: ChimeType) {
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
    CHIME_PLAYERS[chimeType](ctx);
  }, [getAudioContext, chimeType]);

  return { playChime };
}
