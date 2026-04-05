// =====================================================================
// entities.js  ― プレイヤー & ピースエンティティ（改善版）
// =====================================================================

const LANE_X = [-120, -40, 40, 120];

class Player {
  constructor(id) {
    this.id   = id;
    this.lane = id === 1 ? 2 : 3;
    this.x    = LANE_X[this.lane - 1];
    this.baseY = 110;
    this.y    = this.baseY;
    this.bobPhase     = id === 1 ? 0 : Math.PI;
    this.moveCooldown = 0;
  }

  update(dt) {
    this.bobPhase += dt * 8;
    this.y = this.baseY + Math.abs(Math.sin(this.bobPhase)) * (-6);
    const targetX = LANE_X[this.lane - 1];
    this.x += (targetX - this.x) * 18 * dt;
    if (this.moveCooldown > 0) this.moveCooldown -= dt;
  }

  moveLane(dir) {
    if (this.moveCooldown > 0) return;
    const newLane = Math.max(1, Math.min(4, this.lane + dir));
    if (newLane !== this.lane) {
      this.lane = newLane;
      this.moveCooldown = 0.18;
    }
  }
}

class PieceLane {
  constructor(quiz) {
    this.quiz    = quiz;
    this.z       = 3500;
    this.active  = true;
    this.hit     = false;
    this.correct = false;
    this.hitLane = -1;
  }

  update(dt) {
    const accel = 1 + (3500 - this.z) / 3500 * 1.3;
    this.z -= 360 * accel * dt;
    // z<0 でカメラ後方に抜けたら即座に非アクティブ化
    // （以前は -200 まで待っていたため、project() が z=1 にクランプして
    //   看板が画面いっぱいに巨大表示＝テレポートバグの原因だった）
    if (this.z < 0) this.active = false;
  }

  // 判定ウィンドウ拡大：z=30〜450（元は50〜300）
  checkHit(player1, player2) {
    if (this.hit || !this.active) return false;
    if (!player1 || !player2) return false;
    if (this.z > 450 || this.z < 30) return false;
    if (player1.lane !== player2.lane) return false;

    const laneNum = player1.lane;
    const targetX = LANE_X[laneNum - 1];
    const p1ok = Math.abs(player1.x - targetX) < 90;
    const p2ok = Math.abs(player2.x - targetX) < 90;

    if (p1ok && p2ok) {
      this.hit     = true;
      this.hitLane = laneNum;
      this.correct = (laneNum === this.quiz.correct);
      return true;
    }
    return false;
  }
}