// =====================================================================
// renderer.js  ― 擬似3D廊下描画（cx/cy修正・プレイヤーUI改善版）
// =====================================================================
const Renderer = {
  canvas: null,
  ctx: null,
  focalLength: 280,
  hallW: 160,
  hallH: 110,
  cx: 400,
  cy: 300,

  init() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx    = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  },

  // 3D→2D射影
  project(x, y, z) {
    if (z <= 1) z = 1;
    const s = this.focalLength / z;
    return { x: this.cx + x * s, y: this.cy + y * s, s };
  },

  // 進行度(0〜1)に応じた背景テーマ（朝→昼→夕方）
  _getBgTheme(progress) {
    if (progress < 0.5) {
      const t = progress / 0.5;
      return {
        sky:   this._lerpColor('#a8ccf0', '#e0f0ff', t),
        floor: this._lerpColor('#c0a070', '#cca870', t),
        ceil:  this._lerpColor('#ede0d0', '#ffffff', t),
        wallL: this._lerpColor('#a0b0c8', '#b0c0d8', t),
        wallR: this._lerpColor('#90a0b8', '#a0b0c8', t),
        win:   this._lerpColor('#4488ee', '#80b0ff', t),
      };
    } else {
      const t = (progress - 0.5) / 0.5;
      return {
        sky:   this._lerpColor('#e0f0ff', '#ff8040', t),
        floor: this._lerpColor('#cca870', '#b87040', t),
        ceil:  this._lerpColor('#ffffff', '#ffcc88', t),
        wallL: this._lerpColor('#b0c0d8', '#cc9060', t),
        wallR: this._lerpColor('#a0b0c8', '#bc8050', t),
        win:   this._lerpColor('#80b0ff', '#ff6020', t),
      };
    }
  },

  _lerpColor(c1, c2, t) {
    const parse = (c) => {
      const v = parseInt(c.slice(1), 16);
      return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    };
    const [r1, g1, b1] = parse(c1);
    const [r2, g2, b2] = parse(c2);
    return `rgb(${Math.round(r1 + (r2-r1)*t)},${Math.round(g1 + (g2-g1)*t)},${Math.round(b1 + (b2-b1)*t)})`;
  },

  // -----------------------------------------------------------------
  render(dt, game) {
    const ctx = this.ctx;
    const W   = this.canvas.width;
    const H   = this.canvas.height;

    // 空
    const theme = this._getBgTheme(game.progress);
    ctx.fillStyle = theme.sky;
    ctx.fillRect(0, 0, W, H);

    // 廊下セグメント描画
    const segLen     = 280;
    const scrollZ    = game.scrollZ;
    const offsetZ    = scrollZ % segLen;
    const numSeg     = 16;
    const sharedLane = game.getSharedLane();

    for (let i = numSeg; i >= 0; i--) {
      const zFar  = i * segLen - offsetZ + 10;
      const zNear = (i - 1) * segLen - offsetZ + 10;
      if (zNear < 5 && zFar < 5) continue;
      const even = Math.floor((scrollZ + zNear) / segLen) % 2 === 0;
      this._drawSegment(zNear, zFar, even, theme, sharedLane);
    }

    // ピース看板
    if (game.pieceLane && game.pieceLane.active) {
      this._drawPieces(game.pieceLane, game);
    }

    // 「2人で同じレーンへ！」ヒント
    if (game.pieceLane && game.pieceLane.active &&
        game.pieceLane.z < 500 && sharedLane < 0) {
      this._drawAlignHint(ctx, game.pieceLane.z);
    }

    // プレイヤー描画（奥側→手前側の順：2P が手前なら後ろ先）
    // 常に1Pを先に描いて2Pを後で描く（重なり順）
    if (game.player1) this._drawPlayer(game.player1, '#00e5ff', '甲斐先生', '1P');
    if (game.player2) this._drawPlayer(game.player2, '#ff80ab', '木下先生', '2P');
  },

  // -----------------------------------------------------------------
  // ヒント「2人で同じレーンへ！」
  _drawAlignHint(ctx, z) {
    const alpha = Math.min(1, (500 - z) / 200);
    const hintX = this.cx;                             // ← ハードコード修正
    const hintY = this.canvas.height * 0.82;           // ← 画面高さに連動
    ctx.save();
    ctx.globalAlpha = alpha * 0.92;
    ctx.font        = 'bold 20px DotGothic16, sans-serif';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';

    // 背景
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    const tw = ctx.measureText('>  2人で同じレーンへ！  <').width;
    ctx.fillRect(hintX - tw/2 - 10, hintY - 14, tw + 20, 28);

    ctx.lineWidth   = 5;
    ctx.strokeStyle = '#000';
    ctx.strokeText('>  2人で同じレーンへ！  <', hintX, hintY);
    ctx.fillStyle   = '#ffdd00';
    ctx.fillText   ('>  2人で同じレーンへ！  <', hintX, hintY);
    ctx.restore();
  },

  // -----------------------------------------------------------------
  _drawSegment(zNear, zFar, isEven, theme, sharedLane) {
    const ctx = this.ctx;
    const zn  = Math.max(8, zNear);
    const zf  = Math.max(8, zFar);

    const tl1 = this.project(-this.hallW, -this.hallH, zn);
    const tr1 = this.project( this.hallW, -this.hallH, zn);
    const bl1 = this.project(-this.hallW,  this.hallH, zn);
    const br1 = this.project( this.hallW,  this.hallH, zn);
    const tl2 = this.project(-this.hallW, -this.hallH, zf);
    const tr2 = this.project( this.hallW, -this.hallH, zf);
    const bl2 = this.project(-this.hallW,  this.hallH, zf);
    const br2 = this.project( this.hallW,  this.hallH, zf);

    const cF = isEven ? theme.floor : this._darken(theme.floor, 0.92);
    const cC = isEven ? theme.ceil  : this._darken(theme.ceil,  0.95);
    const cL = isEven ? theme.wallL : this._darken(theme.wallL, 0.93);
    const cR = isEven ? theme.wallR : this._darken(theme.wallR, 0.93);

    // 床・天井・壁
    this._quad(bl1, bl2, br2, br1, cF);
    this._quad(tl1, tl2, tr2, tr1, cC);
    this._quad(tl1, tl2, bl2, bl1, cL);
    this._quad(tr1, br1, br2, tr2, cR);

    // 同一レーン ハイライト（黄色）
    if (sharedLane >= 1 && sharedLane <= 4) {
      const li  = sharedLane - 1;
      const lxL = -this.hallW + li       * (this.hallW * 2 / 4);
      const lxR = -this.hallW + (li + 1) * (this.hallW * 2 / 4);
      const hl1 = this.project(lxL, this.hallH, zn);
      const hl2 = this.project(lxL, this.hallH, zf);
      const hl3 = this.project(lxR, this.hallH, zf);
      const hl4 = this.project(lxR, this.hallH, zn);
      this._quad(hl1, hl2, hl3, hl4, 'rgba(255,220,30,0.30)');
    }

    // 窓
    if (isEven) {
      const wTop = -this.hallH * 0.55;
      const wBot =  this.hallH * 0.15;
      this._quad(
        this.project(-this.hallW, wTop, zn), this.project(-this.hallW, wTop, zf),
        this.project(-this.hallW, wBot, zf), this.project(-this.hallW, wBot, zn),
        theme.win
      );
      this._quad(
        this.project( this.hallW, wTop, zn), this.project( this.hallW, wTop, zf),
        this.project( this.hallW, wBot, zf), this.project( this.hallW, wBot, zn),
        theme.win
      );
    }

    // 床・天井 区切り線
    ctx.strokeStyle = 'rgba(0,0,0,0.22)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(bl1.x, bl1.y); ctx.lineTo(br1.x, br1.y);
    ctx.moveTo(tl1.x, tl1.y); ctx.lineTo(tr1.x, tr1.y);
    ctx.stroke();

    // レーン区切り線（床）
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    for (let li = 1; li < 4; li++) {
      const lx = -this.hallW + li * (this.hallW * 2 / 4);
      const ln = this.project(lx, this.hallH, zn);
      const lf = this.project(lx, this.hallH, zf);
      ctx.beginPath();
      ctx.moveTo(ln.x, ln.y); ctx.lineTo(lf.x, lf.y);
      ctx.stroke();
    }
  },

  _darken(color, factor) {
    const m = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (!m) return color;
    return `rgb(${Math.round(m[1]*factor)},${Math.round(m[2]*factor)},${Math.round(m[3]*factor)})`;
  },

  _quad(a, b, c, d, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.fill();
  },

  // -----------------------------------------------------------------
  // ピース看板描画（全看板は同一デザイン・ヒット後のみ色変化）
  _drawPieces(pl, game) {
    const ctx  = this.ctx;
    const quiz = pl.quiz;
    const z    = pl.z;

    const testProj = this.project(0, 0, z);
    if (!testProj || testProj.s < 0.015) return;

    // フェードイン（遠距離）
    const alpha = Math.min(1, (3500 - z) / 700);

    ctx.save();
    ctx.globalAlpha = Math.max(0.08, alpha);

    // ヒット後の発光パルス（時間で点滅）
    const pulseT = Date.now() / 180;

    for (let li = 0; li < 4; li++) {
      const laneX = LANE_X[li];
      const proj  = this.project(laneX, 20, z);
      if (!proj || proj.s < 0.015) continue;

      const w  = 88 * proj.s;
      const h  = 66 * proj.s;
      const px = proj.x;
      const py = proj.y - h;
      const r  = Math.max(2, 5 * proj.s);

      const isCorrect = (li + 1) === quiz.correct;

      // ─── 色の決定（ヒット前は全看板同じ、ヒット後のみ変化）───
      let boardBg     = '#faf6e4';          // ヒット前：全看板クリーム色
      let boardBorder = 'rgba(80,60,20,0.9)'; // ヒット前：全看板濃い茶枠
      let badgeBg     = '#3a6ebf';          // ヒット前：全看板青バッジ
      let badgeText   = '#ffffff';
      let textColor   = '#2a1a00';

      if (pl.hit) {
        if (isCorrect) {
          boardBg     = '#d4fce0';
          boardBorder = '#00aa44';
          badgeBg     = '#00aa44';
          badgeText   = '#ffffff';
          textColor   = '#004422';
        } else {
          boardBg     = '#ffe0e0';
          boardBorder = '#cc2222';
          badgeBg     = '#cc2222';
          badgeText   = '#ffffff';
          textColor   = '#550000';
        }
      }

      // ─── 近づくほど発光（ヒット前）───
      ctx.shadowBlur = 0;
      if (!pl.hit && z < 450) {
        ctx.shadowColor = '#ffe080';
        ctx.shadowBlur  = Math.max(0, (450 - z) / 22);
      }
      // ヒット後：正解は緑点滅、不正解は赤点滅
      if (pl.hit) {
        if (isCorrect) {
          ctx.shadowColor = '#44ff88';
          ctx.shadowBlur  = 10 + Math.sin(pulseT) * 8;
        } else {
          ctx.shadowColor = '#ff4444';
          ctx.shadowBlur  = 6 + Math.sin(pulseT) * 4;
        }
      }

      // ─── 看板本体 ───
      ctx.fillStyle   = boardBg;
      ctx.strokeStyle = boardBorder;
      ctx.lineWidth   = Math.max(1.5, 3 * proj.s);
      this._roundRect(ctx, px - w/2, py, w, h, r);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ─── 上部カラーバー（番号バッジ） ───
      const badgeH  = h * 0.34;
      ctx.fillStyle = badgeBg;
      // 上だけ角丸のクリップ
      ctx.save();
      this._roundRect(ctx, px - w/2, py, w, badgeH, r);
      ctx.clip();
      ctx.fillRect(px - w/2, py, w, badgeH);
      ctx.restore();

      // 番号テキスト
      const numSize = Math.max(8, Math.round(24 * proj.s));
      ctx.fillStyle    = badgeText;
      ctx.font         = `bold ${numSize}px DotGothic16, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${li + 1}`, px, py + badgeH * 0.5);

      // ─── 選択肢テキスト（下部エリア） ───
      const txtSize = Math.max(6, Math.round(11 * proj.s));
      ctx.fillStyle    = textColor;
      ctx.font         = `bold ${txtSize}px DotGothic16, sans-serif`;
      ctx.textBaseline = 'middle';

      const choiceText = quiz.choices[li];
      // テキストが長い場合は幅内に収める（省略）
      const maxW  = w * 0.88;
      let displayText = choiceText;
      ctx.font = `bold ${txtSize}px DotGothic16, sans-serif`;
      if (ctx.measureText(displayText).width > maxW) {
        while (displayText.length > 2 && ctx.measureText(displayText + '…').width > maxW) {
          displayText = displayText.slice(0, -1);
        }
        displayText += '…';
      }
      ctx.fillText(displayText, px, py + badgeH + (h - badgeH) * 0.52);

      // ─── 支柱 ───
      const foot = this.project(laneX, this.hallH, z);
      ctx.strokeStyle = '#5a3a10';
      ctx.lineWidth   = Math.max(1.5, 3 * proj.s);
      ctx.beginPath();
      ctx.moveTo(px, py + h);
      ctx.lineTo(foot.x, foot.y);
      ctx.stroke();
    }

    ctx.restore();
  },

  // 角丸矩形ヘルパー
  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  // -----------------------------------------------------------------
  // プレイヤー描画（改善版）
  _drawPlayer(player, color, nameLabel, badge) {
    const ctx  = this.ctx;
    const pz   = 130;
    const proj = this.project(player.x, player.y, pz);
    if (!proj) return;

    const s  = proj.s;
    const pw = 32 * s;
    const ph = 56 * s;
    const px = proj.x;
    const py = proj.y - ph;

    // 影
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(px, proj.y, pw * 0.85, pw * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // 足（交互に動く）
    const legSwing = Math.sin(player.bobPhase) * 7 * s;
    ctx.fillStyle = '#444';
    // 左足
    this._roundRect(ctx, px - pw*0.38, py + ph*0.70, pw*0.27, ph*0.32 + legSwing, 2*s);
    ctx.fill();
    // 右足
    this._roundRect(ctx, px + pw*0.11, py + ph*0.70, pw*0.27, ph*0.32 - legSwing, 2*s);
    ctx.fill();

    // 胴体（制服風）
    ctx.fillStyle = color;
    this._roundRect(ctx, px - pw*0.46, py + ph*0.32, pw*0.92, ph*0.42, 3*s);
    ctx.fill();

    // 胴体ハイライト（光沢）
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    this._roundRect(ctx, px - pw*0.38, py + ph*0.34, pw*0.36, ph*0.16, 2*s);
    ctx.fill();

    // 首
    ctx.fillStyle = '#ffddcc';
    ctx.fillRect(px - pw*0.12, py + ph*0.28, pw*0.24, ph*0.08);

    // 頭部
    ctx.fillStyle = '#ffddcc';
    this._roundRect(ctx, px - pw*0.38, py, pw*0.76, ph*0.34, 5*s);
    ctx.fill();

    // 目
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(px - pw*0.12, py + ph*0.10, pw*0.055, 0, Math.PI*2);
    ctx.arc(px + pw*0.12, py + ph*0.10, pw*0.055, 0, Math.PI*2);
    ctx.fill();

    // 笑顔
    ctx.strokeStyle = '#555';
    ctx.lineWidth   = Math.max(1, 1.5*s);
    ctx.beginPath();
    ctx.arc(px, py + ph*0.24, pw*0.14, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // 髪
    ctx.fillStyle = color;
    this._roundRect(ctx, px - pw*0.4, py - ph*0.04, pw*0.8, ph*0.18, 4*s);
    ctx.fill();

    // バッジ（1P / 2P）
    const bdgSize = Math.max(8, Math.round(10 * s));
    const bdgW    = bdgSize * 2.8;
    const bdgH    = bdgSize * 1.4;
    ctx.fillStyle = color;
    this._roundRect(ctx, px - bdgW/2, py - ph*0.28 - bdgH, bdgW, bdgH, 3*s);
    ctx.fill();
    ctx.fillStyle    = '#000';
    ctx.font         = `bold ${bdgSize}px DotGothic16, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badge, px, py - ph*0.28 - bdgH/2);

    // 名前ラベル
    const lblSize = Math.max(8, Math.round(10 * s));
    ctx.fillStyle    = color;
    ctx.font         = `bold ${lblSize}px DotGothic16, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    // 影
    ctx.strokeStyle  = '#000';
    ctx.lineWidth    = 3 * s;
    ctx.strokeText(nameLabel, px, py - ph*0.28 - bdgH - 2);
    ctx.fillText(nameLabel, px, py - ph*0.28 - bdgH - 2);

    ctx.restore();
  }
};