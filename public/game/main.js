// =====================================================================
// main.js  ― エントリーポイント・画面管理・ゲームループ
// =====================================================================
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  // ===== 学校・クラス情報 =====
  const CLASS_NAME = '2年D組';          // ← 「級」→「組」修正
  const CLASS_PHOTO_PATH = 'photo.png';

  const classNameDisplay = document.getElementById('class-name-display');
  if (classNameDisplay) classNameDisplay.textContent = CLASS_NAME;

  const classPhotoImg = document.getElementById('class-photo-img');
  if (classPhotoImg) classPhotoImg.src = CLASS_PHOTO_PATH;

  // 初期化
  Input.init();
  Renderer.init();

  // ===== キャンバスリサイズ =====
  function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const canvas = document.getElementById('game-canvas');
    const confettiCanvas = document.getElementById('confetti-canvas');
    canvas.width = w;
    canvas.height = h;
    if (confettiCanvas) {
      confettiCanvas.width = w;
      confettiCanvas.height = h;
    }
    // Renderer の投影中心を画面中央に合わせる
    Renderer.cx = w / 2;
    Renderer.cy = h / 2;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ===== 状態管理 =====
  const STATE = { TITLE: 0, COUNTDOWN: 1, PLAYING: 2, CLEAR: 3 };
  let state = STATE.TITLE;
  let lastTime = 0;

  const titleScreen = document.getElementById('title-screen');
  const countdownScreen = document.getElementById('countdown-screen');
  const clearScreen = document.getElementById('clear-screen');

  // ===== タイトル入力待ち =====
  window.addEventListener('keydown', (e) => {
    if (state === STATE.TITLE) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        startCountdown();
      }
    }
  });
  titleScreen.addEventListener('click', () => {
    if (state === STATE.TITLE) startCountdown();
  });

  // ===== カウントダウン =====
  function startCountdown() {
    state = STATE.COUNTDOWN;
    titleScreen.classList.add('hidden');
    countdownScreen.classList.remove('hidden');

    AudioSys.init();

    let count = 3;
    const numEl = document.getElementById('countdown-number');
    numEl.textContent = count;
    AudioSys.playCount();

    const iv = setInterval(() => {
      count--;
      if (count > 0) {
        numEl.textContent = count;
        AudioSys.playCount();
      } else if (count === 0) {
        numEl.textContent = 'GO!';
        AudioSys.playGo();
      } else {
        clearInterval(iv);
        countdownScreen.classList.add('hidden');
        startGame();
      }
    }, 1000);
  }

  // ===== ゲーム開始 =====
  function startGame() {
    state = STATE.PLAYING;
    GameSys.onClear = handleClear;
    GameSys.init();
    AudioSys.startBGM();
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  // ===== ゲームループ =====
  function loop(ts) {
    if (state !== STATE.PLAYING) return;

    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    GameSys.update(dt);
    Renderer.render(dt, GameSys);

    requestAnimationFrame(loop);
  }

  // ===== クリア演出 =====
  function handleClear() {
    state = STATE.CLEAR;
    AudioSys.stopBGM();
    clearScreen.classList.remove('hidden');
    startConfetti();
  }

  // ===== 紙吹雪アニメーション =====
  function startConfetti() {
    const cc = document.getElementById('confetti-canvas');
    if (!cc) return;
    const cctx = cc.getContext('2d');
    const W = cc.width;
    const H = cc.height;

    const COLORS = [
      '#ff4d4d', '#ff9933', '#ffdd00', '#66cc44', '#33aaff',
      '#9966ff', '#ff66bb', '#ffffff', '#ffd700', '#00ffcc'
    ];

    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: Math.random() * -H,
      w: 5 + Math.random() * 9,
      h: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 2.5,
      vy: 1.4 + Math.random() * 3.0,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.22,
      alpha: 0.75 + Math.random() * 0.25,
    }));

    let rafId;
    function draw() {
      cctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
        }
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.globalAlpha = p.alpha;
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cctx.restore();
      });
      rafId = requestAnimationFrame(draw);
    }
    draw();

    setTimeout(() => cancelAnimationFrame(rafId), 10000);
  }
});