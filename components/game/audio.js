// =====================================================================
// audio.js  ― 効果音システム（BGM削除・SE強化版）
// =====================================================================
const AudioSys = {
  ctx: null,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  // ===== BGM は削除（進行度は時刻ベースで計算） =====
  startBGM() {},
  stopBGM()  {},
  getBGMProgress() { return -1; },

  // ===== 内部ヘルパー：単音生成 =====
  _playTone(freq, type, duration, vol = 0.08) {
    if (!this.ctx) return;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  // 周波数を時間でスライドさせる（効果的なブザー用）
  _playSlide(freqStart, freqEnd, type, duration, vol = 0.15) {
    if (!this.ctx) return;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  // ===== SE：正解 ― 派手な上昇ファンファーレ =====
  playCorrect() {
    // Phase 1: 上昇音型（C5 → E5 → G5）
    this._playTone(523,  'sine',     0.22, 0.28);   // C5
    this._playTone(1047, 'triangle', 0.22, 0.10);   // C6 倍音

    setTimeout(() => {
      this._playTone(659,  'sine',     0.22, 0.24);  // E5
      this._playTone(1319, 'triangle', 0.10, 0.24);  // E6 倍音
    }, 90);

    setTimeout(() => {
      this._playTone(784,  'sine',     0.24, 0.28);  // G5
      this._playTone(1568, 'triangle', 0.10, 0.28);  // G6 倍音
    }, 180);

    // Phase 2: Cメジャー和音（クライマックス）
    setTimeout(() => {
      this._playTone(1047, 'sine',     0.26, 0.55);  // C6
      this._playTone(1319, 'sine',     0.22, 0.55);  // E6
      this._playTone(1568, 'sine',     0.18, 0.55);  // G6
      this._playTone(2093, 'triangle', 0.14, 0.45);  // C7 キラキラ
      this._playTone(784,  'sine',     0.16, 0.55);  // G5 ベース感
    }, 280);

    // Phase 3: 余韻のキラキラ
    setTimeout(() => {
      this._playTone(2637, 'sine', 0.18, 0.30);  // E7 高音
      this._playTone(2093, 'sine', 0.12, 0.30);  // C7
    }, 460);
  },

  // ===== SE：不正解 ― 強烈な下降ブザー =====
  playWrong() {
    // Phase 1: 第1ブザー（強い）
    this._playSlide(260, 160, 'sawtooth', 0.22, 0.32);
    this._playTone(130, 'square', 0.22, 0.22);

    // Phase 2: 第2ブザー（さらに低く）
    setTimeout(() => {
      this._playSlide(200, 110, 'sawtooth', 0.25, 0.32);
      this._playTone(100, 'square', 0.22, 0.25);
      this._playTone(155, 'sawtooth', 0.18, 0.25);
    }, 230);

    // Phase 3: 最後の強打（最大音量）
    setTimeout(() => {
      this._playSlide(170, 80, 'sawtooth', 0.55, 0.35);
      this._playTone(90,  'square',   0.28, 0.55);
      this._playTone(60,  'sawtooth', 0.20, 0.55);
    }, 460);
  },

  // ===== カウントダウン・スタートSE =====
  playCount() {
    this._playTone(440, 'square', 0.1, 0.08);
  },

  playGo() {
    this._playTone(660,  'square', 0.08, 0.10);
    setTimeout(() => this._playTone(880,  'square', 0.12, 0.10), 80);
    setTimeout(() => this._playTone(1320, 'square', 0.25, 0.10), 160);
    setTimeout(() => {
      this._playTone(1760, 'sine', 0.20, 0.35);
      this._playTone(2200, 'sine', 0.14, 0.30);
    }, 250);
  }
};