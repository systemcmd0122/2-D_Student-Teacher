// =====================================================================
// game.js  ― ゲームシステム（絵文字なし・バグ修正完全版）
// =====================================================================
const GameSys = {
  player1: null,
  player2: null,

  scrollZ: 0,
  speedZ: 480,
  timePlayed: 0,
  progress: 0,
  TOTAL_TIME: 300,

  pieceLane: null,
  quizCooldown: 0,
  QUIZ_INTERVAL: 2.2,

  piecesCollected: 0,
  TOTAL_PIECES: 40,

  feedbackTimer: 0,

  onClear: null,
  _clearFired: false,

  _pendingQuiz: null,
  _spawnDelay: 0,
  _resultTimer: 0,
  _showResult: false,

  init() {
    this.player1 = new Player(1);
    this.player2 = new Player(2);
    this.scrollZ = 0;
    this.timePlayed = 0;
    this.progress = 0;
    this.pieceLane = null;
    this.quizCooldown = 2.0;
    this._pendingQuiz = null;
    this._spawnDelay = 0;
    this.piecesCollected = 0;
    this.feedbackTimer = 0;
    this._clearFired = false;
    this._resultTimer = 0;
    this._showResult = false;
    QuizMgr.init();
    this._initPhotoGrid();
    this._updateHUD();
  },

  _initPhotoGrid() {
    const grid = document.getElementById('photo-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 8列 × 5行 = 40スロット（余白なし・ピッタリ40枚）
    const COLS = 8;
    const ROWS = 5; // 8 × 5 = 40

    // グリッドの列数・行数をCSSに反映
    grid.style.gridTemplateColumns = 'repeat(' + COLS + ', 1fr)';
    grid.style.gridTemplateRows = 'repeat(' + ROWS + ', 1fr)';

    // 40枚ぴったり作成（余白スロットなし）
    for (let i = 0; i < this.TOTAL_PIECES; i++) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.id = 'piece-' + i;
      grid.appendChild(piece);
    }
    this._updatePieceCount();
  },

  _updatePieceCount() {
    const el = document.getElementById('piece-count');
    if (el) el.textContent = this.piecesCollected + ' / ' + this.TOTAL_PIECES + '  枚';
  },

  _revealPiece() {
    const idx = this.piecesCollected - 1;
    const el = document.getElementById('piece-' + idx);
    if (el) {
      el.classList.add('revealed');
    }
    this._updatePieceCount();
    const countEl = document.getElementById('piece-count');
    if (countEl) {
      countEl.style.textShadow = '0 0 18px rgba(255,220,0,0.98), 0 0 32px rgba(255,200,0,0.5)';
      setTimeout(function () {
        if (countEl) countEl.style.textShadow = '0 0 8px rgba(200,168,0,0.5)';
      }, 800);
    }
  },

  getSharedLane() {
    if (this.player1 && this.player2 && this.player1.lane === this.player2.lane) {
      return this.player1.lane;
    }
    return -1;
  },

  // ─── HUD 更新 ───
  _updateHUD() {
    if (!this.player1 || !this.player2) return;

    const p1Lane = this.player1.lane;
    const p2Lane = this.player2.lane;

    for (let i = 1; i <= 4; i++) {
      const d1 = document.getElementById('p1-l' + i);
      const d2 = document.getElementById('p2-l' + i);
      if (d1) d1.classList.toggle('active', i === p1Lane);
      if (d2) d2.classList.toggle('active', i === p2Lane);
    }

    const syncBadge = document.getElementById('sync-badge');
    if (syncBadge) {
      syncBadge.classList.toggle('hidden', this.getSharedLane() < 1);
    }

    const pct = (this.piecesCollected / this.TOTAL_PIECES) * 100;
    const fill = document.getElementById('progress-bar-fill');
    if (fill) fill.style.width = Math.min(100, pct) + '%';

    const label = document.getElementById('progress-bar-label');
    if (label) label.textContent = this.piecesCollected + ' / ' + this.TOTAL_PIECES;

    const remNum = document.getElementById('quiz-remaining-num');
    if (remNum) remNum.textContent = Math.max(0, this.TOTAL_PIECES - this.piecesCollected);
  },

  update(dt) {
    this.timePlayed += dt;
    this.scrollZ += this.speedZ * dt;

    const bgmProg = (typeof AudioSys !== 'undefined') ? AudioSys.getBGMProgress() : -1;
    this.progress = (bgmProg >= 0) ? bgmProg : Math.min(1, this.timePlayed / this.TOTAL_TIME);

    if (this.player1) this.player1.update(dt);
    if (this.player2) this.player2.update(dt);

    if (typeof Input !== 'undefined') {
      if (Input.consume('KeyA')) this.player1 && this.player1.moveLane(-1);
      if (Input.consume('KeyD')) this.player1 && this.player1.moveLane(1);
      if (Input.consume('ArrowLeft')) this.player2 && this.player2.moveLane(-1);
      if (Input.consume('ArrowRight')) this.player2 && this.player2.moveLane(1);
    }

    this._updateQuiz(dt);

    if (this.feedbackTimer > 0) {
      this.feedbackTimer -= dt;
      if (this.feedbackTimer <= 0) this._hideFeedback();
    }

    if (this._resultTimer > 0) {
      this._resultTimer -= dt;
      if (this._resultTimer <= 0) {
        this._showResult = false;
        this._hideResultBanner();
      }
    }

    this._updateHUD();
  },

  _updateQuiz(dt) {
    // ── ① 看板スポーン待機中 ──────────────────────────────
    if (this._pendingQuiz && !this.pieceLane) {
      this._spawnDelay -= dt;
      if (this._spawnDelay <= 0) {
        this.pieceLane = new PieceLane(this._pendingQuiz);
        this._pendingQuiz = null;
      }
      return;
    }

    // ── ② 看板が存在する ─────────────────────────────────
    if (this.pieceLane) {

      // ★ ヒット判定を update より先に実行する
      //    （旧コードは update 後に判定していたため、z≈35→-6 など
      //      1フレームでヒット窓[30-450]を飛び越えた場合に
      //      判定が完全スキップされるバグがあった）
      if (!this.pieceLane.hit) {
        if (this.pieceLane.checkHit(this.player1, this.player2)) {
          const isCorrect = this.pieceLane.correct;
          const quiz     = this.pieceLane.quiz;
          const hitLane  = this.pieceLane.hitLane;
          this.pieceLane = null;
          this._hideQuizUI();
          this._onAnswer(isCorrect, quiz, hitLane);
          return;
        }
      }

      // ★ ヒット判定の後に z を進める
      this.pieceLane.update(dt);

      // ★ 看板がカメラ後方へ抜けた（entities.js 側で z<0 → active=false）
      //    旧コードは active=false まで待つ間も巨大表示バグが出ていた
      if (!this.pieceLane.active) {
        const quiz = this.pieceLane.quiz;
        this.pieceLane = null;
        this._hideQuizUI();
        this._onMiss(quiz);
        return;
      }

      return;
    }

    // ── ③ 次のクイズをスポーン ───────────────────────────
    if (!this._pendingQuiz) {
      this.quizCooldown -= dt;
      if (this.quizCooldown <= 0 && QuizMgr.hasNext()) {
        this._spawnQuiz();
      }
    }
  },

  _spawnQuiz() {
    const quiz = QuizMgr.next();
    if (!quiz) return;
    this._showQuizUI(quiz);
    this._pendingQuiz = quiz;
    this._spawnDelay = 2.5;
  },

  _showQuizUI(quiz) {
    const popup = document.getElementById('quiz-popup');
    const qEl = document.getElementById('quiz-question');
    if (!popup || !qEl) return;
    let html = 'Q. ' + quiz.question + '\n';
    quiz.choices.forEach(function (c, i) { html += '\n[' + (i + 1) + '] ' + c; });
    qEl.textContent = html;
    popup.classList.remove('hidden');
  },

  _hideQuizUI() {
    const popup = document.getElementById('quiz-popup');
    if (popup) popup.classList.add('hidden');
  },

  // ─── 結果バナー ───
  _showResultBanner(quiz, selectedLane, isCorrect, p1Correct, p2Correct) {
    const banner = document.getElementById('result-banner');
    if (!banner || !quiz) return;

    const correctLane = quiz.correct;
    const correctName = quiz.choices[correctLane - 1];
    const correctPct = quiz.choicesPct[correctLane - 1];
    const totalVotes = quiz.totalVotes;

    // プレイヤー判定テキスト（絵文字なし）
    let playerResult = '';
    if (p1Correct && p2Correct) {
      playerResult = '[○] 甲斐先生・木下先生  両者正解！';
    } else if (p1Correct) {
      playerResult = '[○] 甲斐先生（1P）正解  /  [×] 木下先生（2P）不正解';
    } else if (p2Correct) {
      playerResult = '[×] 甲斐先生（1P）不正解  /  [○] 木下先生（2P）正解';
    } else {
      playerResult = '[×] 甲斐先生・木下先生  両者不正解';
    }

    // 棒グラフ HTML
    let barsHtml = '';
    for (let i = 0; i < quiz.choices.length; i++) {
      const isWinner = (i + 1) === quiz.correct;
      const isSelected = (i + 1) === selectedLane;
      const pct = quiz.choicesPct[i];
      const count = quiz.choicesCount ? quiz.choicesCount[i] : '';
      const barCls = isWinner
        ? 'result-bar winner-bar'
        : (isSelected && !isWinner ? 'result-bar wrong-bar' : 'result-bar');
      // 絵文字なし：1位は「No.1」、選択は「>」
      const medal = isWinner ? 'No.1 ' : (isSelected && !isWinner ? '>    ' : '     ');
      barsHtml +=
        '<div class="result-row' + (isWinner ? ' winner-row' : '') + '">' +
        '<span class="result-name">' + medal + quiz.choices[i] + '</span>' +
        '<div class="result-bar-wrap"><div class="' + barCls + '" style="width:' + Math.max(pct, 2) + '%"></div></div>' +
        '<span class="result-pct">' + pct + '%<span class="vote-count">(' + count + '票)</span></span>' +
        '</div>';
    }

    // タイトル（絵文字なし）
    const resultTitle = isCorrect
      ? '[正解]  ' + correctName + '  ' + correctPct + '% で1位！'
      : '[不正解]  1位は ' + correctName + '  ' + correctPct + '%';

    let html =
      '<div class="result-title ' + (isCorrect ? 'correct' : 'wrong') + '">' + resultTitle + '</div>' +
      '<div class="result-players">' + playerResult + '</div>' +
      '<div class="result-question">「' + quiz.question + '」</div>' +
      '<div class="result-bars">' + barsHtml + '</div>' +
      '<div class="result-total">クラス投票総数: ' + totalVotes + '票</div>';

    banner.innerHTML = html;
    banner.classList.remove('hidden');
    this._showResult = true;
    this._resultTimer = 4.5;
  },

  _hideResultBanner() {
    const banner = document.getElementById('result-banner');
    if (banner) banner.classList.add('hidden');
  },

  // ─── ヒット：2人が同じレーンで看板に触れた ───
  _onAnswer(isCorrect, quiz, hitLane) {
    this.piecesCollected++;
    this._revealPiece();

    if (isCorrect) {
      this._showFeedback('2人で正解！', 'correct');
      if (typeof AudioSys !== 'undefined') AudioSys.playCorrect();
    } else {
      this._showFeedback('2人で不正解…', 'wrong');
      if (typeof AudioSys !== 'undefined') AudioSys.playWrong();
    }

    if (quiz) this._showResultBanner(quiz, hitLane, isCorrect, isCorrect, isCorrect);
    this.quizCooldown = this.QUIZ_INTERVAL + 4.0;

    if (this.piecesCollected >= this.TOTAL_PIECES) this._triggerClear();
  },

  // ─── ミス：看板が通り過ぎた ───
  _onMiss(quiz) {
    this.piecesCollected++;
    this._revealPiece();

    if (quiz) {
      const p1Lane = this.player1 ? this.player1.lane : -1;
      const p2Lane = this.player2 ? this.player2.lane : -1;
      const correctLane = quiz.correct;
      const p1Correct = (p1Lane === correctLane);
      const p2Correct = (p2Lane === correctLane);

      let feedbackText = '';
      let feedbackClass = 'wrong';

      if (p1Correct && p2Correct) {
        feedbackText = '答えは正解だったが\n2人でそろえてね！';
        feedbackClass = 'correct';
        if (typeof AudioSys !== 'undefined') AudioSys.playCorrect();
      } else if (p1Correct) {
        feedbackText = '甲斐先生は正解\n木下先生は不正解';
        if (typeof AudioSys !== 'undefined') AudioSys.playWrong();
      } else if (p2Correct) {
        feedbackText = '甲斐先生は不正解\n木下先生は正解';
        if (typeof AudioSys !== 'undefined') AudioSys.playWrong();
      } else {
        feedbackText = '2人とも不正解…';
        if (typeof AudioSys !== 'undefined') AudioSys.playWrong();
      }

      this._showFeedback(feedbackText, feedbackClass);
      // ミスは常に wrong バナー（看板を取り逃した）
      this._showResultBanner(quiz, correctLane, false, p1Correct, p2Correct);
    } else {
      this._showFeedback('スルー…', 'wrong');
      if (typeof AudioSys !== 'undefined') AudioSys.playWrong();
    }

    this.quizCooldown = this.QUIZ_INTERVAL * 0.6 + 3.0;

    if (this.piecesCollected >= this.TOTAL_PIECES) this._triggerClear();
  },

  _triggerClear() {
    if (this._clearFired) return;
    this._clearFired = true;

    // photo-gridに完成アニメーションを追加
    const grid = document.getElementById('photo-grid');
    if (grid) {
      grid.classList.add('complete-animation');
    }

    // アニメーション完了後（1.8秒後）にクリア画面遷移
    setTimeout(function () {
      if (typeof GameSys !== 'undefined' && typeof GameSys.onClear === 'function') {
        GameSys.onClear();
      }
    }, 2300);
  },

  _showFeedback(text, cls) {
    const el = document.getElementById('answer-feedback');
    if (!el) return;
    el.textContent = text;
    el.className = cls;
    this.feedbackTimer = 2.2;
  },

  _hideFeedback() {
    const el = document.getElementById('answer-feedback');
    if (el) el.className = 'hidden';
  }
};