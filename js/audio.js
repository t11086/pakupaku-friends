// サウンド(WebAudio)と英語読み上げ
import { friendCries } from './data.js';

let ctx;
function audio() { return ctx ||= new (window.AudioContext || window.webkitAudioContext)(); }

export function tone(freq, dur = .15, delay = 0, type = 'sine', vol = .25) {
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, a.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(.001, a.currentTime + delay + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + delay); o.stop(a.currentTime + delay + dur);
}

export const sfx = {
  tap: () => tone(600, .08),
  eat: () => { tone(300, .08, 0, 'square', .15); tone(200, .1, .09, 'square', .15); },
  pop: () => tone(900, .1, 0, 'triangle'),
  scrub: () => tone(400 + Math.random() * 300, .05, 0, 'triangle', .1),
  stamp: () => [523, 659, 784].forEach((f, i) => tone(f, .18, i * .12)),
  fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, .22, i * .15, 'triangle', .3)),
  night: () => [660, 550, 440].forEach((f, i) => tone(f, .4, i * .35, 'sine', .15)),
};

export function cry(f) {
  (friendCries[f] || [[600, .1, 0]]).forEach(([fr, d, dl, type, vol]) =>
    tone(fr, d, dl, type || 'triangle', vol ?? .2));
}

// 日本語の合成音声は不自然なため使わない(案内は画面表示のみ)
export function speak() {}

// 英語は自然に聞こえるので、褒め言葉と食べ物の名前だけ明るい声で読み上げる
let enVoice = null;
function pickEnVoice() {
  const vs = speechSynthesis.getVoices().filter(v => v.lang.replace('_', '-').startsWith('en'));
  enVoice = vs.find(v => /Samantha|Google US English/i.test(v.name)) || vs[0] || null;
}
if ('speechSynthesis' in window) {
  pickEnVoice();
  speechSynthesis.onvoiceschanged = pickEnVoice;
}

// queue=true なら前の読み上げを消さずに続けて話す(名前→カウント等)
export function speakEn(text, queue) {
  if (!('speechSynthesis' in window)) return;
  if (!queue) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  if (enVoice) u.voice = enVoice;
  u.rate = .9; u.pitch = 1.4; // ゆっくり・高めで、こわくない明るい声に
  speechSynthesis.speak(u);
}
