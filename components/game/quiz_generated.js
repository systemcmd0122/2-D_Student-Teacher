// =====================================================================
// quiz.js  ― クラス内アンケート結果から生成したクイズデータ
// 正解＝クラスで一番多く票を集めた人 (実際のアンケート結果より)
// =====================================================================
const QuizData = [
  {
    "question": "テスト前日に一番焦ってそうな人は誰?",
    "choices": [
      "有村 涼雅",
      "圖師 陽杜",
      "黒木瑛汰",
      "山内 侑大"
    ],
    "choicesPct": [
      10.3,
      10.3,
      13.8,
      17.2
    ],
    "choicesCount": [
      3,
      3,
      4,
      5
    ],
    "correct": 4,
    "winner": "山内 侑大",
    "winnerPct": 17.2,
    "totalVotes": 29
  },
  {
    "question": "ノートを一番きれいにとってそうな人は誰?",
    "choices": [
      "甲斐 琉捺",
      "内田 有喜亜",
      "安達 太陽",
      "加世田 湊"
    ],
    "choicesPct": [
      55.2,
      3.4,
      10.3,
      6.9
    ],
    "choicesCount": [
      16,
      1,
      3,
      2
    ],
    "correct": 1,
    "winner": "甲斐 琉捺",
    "winnerPct": 55.2,
    "totalVotes": 29
  },
  {
    "question": "先生に一番質問しに行く人は誰?",
    "choices": [
      "黒木瑛汰",
      "岩田 康孝",
      "加世田 湊",
      "寺岡 賢甫"
    ],
    "choicesPct": [
      3.4,
      79.3,
      3.4,
      13.8
    ],
    "choicesCount": [
      1,
      23,
      1,
      4
    ],
    "correct": 2,
    "winner": "岩田 康孝",
    "winnerPct": 79.3,
    "totalVotes": 29
  },
  {
    "question": "黒板の文字を一番小さく写しそうな人は誰?",
    "choices": [
      "中田 凜",
      "内田 有喜亜",
      "西田 頼寿",
      "甲斐 琉捺"
    ],
    "choicesPct": [
      6.9,
      6.9,
      6.9,
      20.7
    ],
    "choicesCount": [
      2,
      2,
      2,
      6
    ],
    "correct": 4,
    "winner": "甲斐 琉捺",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "授業中に一番関係ないことを考えていそうな人は誰?",
    "choices": [
      "黒木瑛汰",
      "石井 貴哉",
      "山内 侑大",
      "黒木 碧"
    ],
    "choicesPct": [
      6.9,
      13.8,
      24.1,
      17.2
    ],
    "choicesCount": [
      2,
      4,
      7,
      5
    ],
    "correct": 3,
    "winner": "山内 侑大",
    "winnerPct": 24.1,
    "totalVotes": 29
  },
  {
    "question": "先生にあてられても一番堂々と答える人は誰?",
    "choices": [
      "岩田 康孝",
      "山内 侑大",
      "加世田 湊",
      "寺岡 賢甫"
    ],
    "choicesPct": [
      37.9,
      24.1,
      6.9,
      10.3
    ],
    "choicesCount": [
      11,
      7,
      2,
      3
    ],
    "correct": 1,
    "winner": "岩田 康孝",
    "winnerPct": 37.9,
    "totalVotes": 29
  },
  {
    "question": "ゲームがクラスで一番強い人は誰?",
    "choices": [
      "有村 涼雅",
      "安達 太陽",
      "前原 漸佑",
      "加藤 希空丸"
    ],
    "choicesPct": [
      31.0,
      27.6,
      20.7,
      3.4
    ],
    "choicesCount": [
      9,
      8,
      6,
      1
    ],
    "correct": 1,
    "winner": "有村 涼雅",
    "winnerPct": 31.0,
    "totalVotes": 29
  },
  {
    "question": "休日に一番家から出なさそうな人は誰?",
    "choices": [
      "谷口 夢生",
      "盛田 可夢偉",
      "前原 漸佑",
      "甲斐 黄純"
    ],
    "choicesPct": [
      10.3,
      6.9,
      10.3,
      13.8
    ],
    "choicesCount": [
      3,
      2,
      3,
      4
    ],
    "correct": 4,
    "winner": "甲斐 黄純",
    "winnerPct": 13.8,
    "totalVotes": 29
  },
  {
    "question": "SNSの投稿が一番多い人は誰?",
    "choices": [
      "塩月 瑠衣",
      "徳田 太祐",
      "中田 凜",
      "安達 太陽"
    ],
    "choicesPct": [
      10.3,
      6.9,
      17.2,
      20.7
    ],
    "choicesCount": [
      3,
      2,
      5,
      6
    ],
    "correct": 4,
    "winner": "安達 太陽",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "音楽の趣味が一番マニアックな人は誰?",
    "choices": [
      "山内 侑大",
      "黒木 碧",
      "築池 康平",
      "河野 天智"
    ],
    "choicesPct": [
      20.7,
      10.3,
      6.9,
      6.9
    ],
    "choicesCount": [
      6,
      3,
      2,
      2
    ],
    "correct": 1,
    "winner": "山内 侑大",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "映画を一番たくさん見ていそうな人は誰?",
    "choices": [
      "松尾 紀香",
      "石井 貴哉",
      "圖師 陽杜",
      "安達 太陽"
    ],
    "choicesPct": [
      6.9,
      13.8,
      6.9,
      41.4
    ],
    "choicesCount": [
      2,
      4,
      2,
      12
    ],
    "correct": 4,
    "winner": "安達 太陽",
    "winnerPct": 41.4,
    "totalVotes": 29
  },
  {
    "question": "漫画を一番読んでいそうな人は誰?",
    "choices": [
      "安達 太陽",
      "黒木瑛汰",
      "有村 涼雅",
      "日高 琥太"
    ],
    "choicesPct": [
      6.9,
      17.2,
      13.8,
      6.9
    ],
    "choicesCount": [
      2,
      5,
      4,
      2
    ],
    "correct": 2,
    "winner": "黒木瑛汰",
    "winnerPct": 17.2,
    "totalVotes": 29
  },
  {
    "question": "一番料理が上手そうな人は誰?",
    "choices": [
      "塩月 瑠衣",
      "田口 瑞姫",
      "安達 太陽",
      "甲斐 琉捺"
    ],
    "choicesPct": [
      10.3,
      6.9,
      24.1,
      13.8
    ],
    "choicesCount": [
      3,
      2,
      7,
      4
    ],
    "correct": 3,
    "winner": "安達 太陽",
    "winnerPct": 24.1,
    "totalVotes": 29
  },
  {
    "question": "一番夜更かししていそうな人は誰?",
    "choices": [
      "有村 涼雅",
      "永野乃愛",
      "山本 泰綺",
      "徳田 太祐"
    ],
    "choicesPct": [
      10.3,
      10.3,
      10.3,
      24.1
    ],
    "choicesCount": [
      3,
      3,
      3,
      7
    ],
    "correct": 4,
    "winner": "徳田 太祐",
    "winnerPct": 24.1,
    "totalVotes": 29
  },
  {
    "question": "推し活に一番お金をかけていそうな人は誰?",
    "choices": [
      "日高 琥太",
      "安達 太陽",
      "有村 涼雅",
      "黒木 碧"
    ],
    "choicesPct": [
      6.9,
      17.2,
      20.7,
      6.9
    ],
    "choicesCount": [
      2,
      5,
      6,
      2
    ],
    "correct": 3,
    "winner": "有村 涼雅",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "体育の授業で一番張り切っていた人は誰?",
    "choices": [
      "岩田 康孝",
      "黒木瑛汰",
      "山内 侑大",
      "加世田 湊"
    ],
    "choicesPct": [
      6.9,
      13.8,
      51.7,
      10.3
    ],
    "choicesCount": [
      2,
      4,
      15,
      3
    ],
    "correct": 3,
    "winner": "山内 侑大",
    "winnerPct": 51.7,
    "totalVotes": 29
  },
  {
    "question": "体育でチーム分けするとき一番最初に選ばれる人は誰?",
    "choices": [
      "圖師 陽杜",
      "黒木瑛汰",
      "安達 太陽",
      "加藤 希空丸"
    ],
    "choicesPct": [
      20.7,
      13.8,
      17.2,
      10.3
    ],
    "choicesCount": [
      6,
      4,
      5,
      3
    ],
    "correct": 1,
    "winner": "圖師 陽杜",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "水泳が一番得意な人は誰?",
    "choices": [
      "安達 太陽",
      "加藤 希空丸",
      "松尾 紀香",
      "谷口 夢生"
    ],
    "choicesPct": [
      51.7,
      3.4,
      41.4,
      3.4
    ],
    "choicesCount": [
      15,
      1,
      12,
      1
    ],
    "correct": 1,
    "winner": "安達 太陽",
    "winnerPct": 51.7,
    "totalVotes": 29
  },
  {
    "question": "クラスで一番天然キャラといえば?",
    "choices": [
      "岩田 康孝",
      "高山 莞寧",
      "甲斐 黄純",
      "西田 頼寿"
    ],
    "choicesPct": [
      27.6,
      13.8,
      6.9,
      10.3
    ],
    "choicesCount": [
      8,
      4,
      2,
      3
    ],
    "correct": 1,
    "winner": "岩田 康孝",
    "winnerPct": 27.6,
    "totalVotes": 29
  },
  {
    "question": "毒舌だけど愛されている人は誰?",
    "choices": [
      "西田 頼寿",
      "黒木 碧",
      "甲斐 黄純",
      "徳田 太祐"
    ],
    "choicesPct": [
      6.9,
      17.2,
      10.3,
      20.7
    ],
    "choicesCount": [
      2,
      5,
      3,
      6
    ],
    "correct": 4,
    "winner": "徳田 太祐",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "一番マイペースな人は誰?",
    "choices": [
      "的場 勇都",
      "西田 頼寿",
      "染川 凛",
      "岩田 康孝"
    ],
    "choicesPct": [
      6.9,
      13.8,
      10.3,
      10.3
    ],
    "choicesCount": [
      2,
      4,
      3,
      3
    ],
    "correct": 2,
    "winner": "西田 頼寿",
    "winnerPct": 13.8,
    "totalVotes": 29
  },
  {
    "question": "一番涙もろいそうな人は誰?",
    "choices": [
      "永野乃愛",
      "田口 瑞姫",
      "染川 凛",
      "中田 凜"
    ],
    "choicesPct": [
      24.1,
      13.8,
      6.9,
      27.6
    ],
    "choicesCount": [
      7,
      4,
      2,
      8
    ],
    "correct": 4,
    "winner": "中田 凜",
    "winnerPct": 27.6,
    "totalVotes": 29
  },
  {
    "question": "一番笑いのツボが浅そう人は誰?",
    "choices": [
      "黒木瑛汰",
      "的場 勇都",
      "徳田 太祐",
      "田口 瑞姫"
    ],
    "choicesPct": [
      10.3,
      6.9,
      10.3,
      10.3
    ],
    "choicesCount": [
      3,
      2,
      3,
      3
    ],
    "correct": 3,
    "winner": "徳田 太祐",
    "winnerPct": 10.3,
    "totalVotes": 29
  },
  {
    "question": "一番秘密を守る人は誰?",
    "choices": [
      "圖師 陽杜",
      "甲斐 琉捺",
      "安達 太陽",
      "加世田 湊"
    ],
    "choicesPct": [
      10.3,
      10.3,
      10.3,
      10.3
    ],
    "choicesCount": [
      3,
      3,
      3,
      3
    ],
    "correct": 4,
    "winner": "加世田 湊",
    "winnerPct": 10.3,
    "totalVotes": 29
  },
  {
    "question": "一番空気が読める人は誰?",
    "choices": [
      "圖師 陽杜",
      "加世田 湊",
      "甲斐 琉捺",
      "安達 太陽"
    ],
    "choicesPct": [
      10.3,
      27.6,
      10.3,
      10.3
    ],
    "choicesCount": [
      3,
      8,
      3,
      3
    ],
    "correct": 2,
    "winner": "加世田 湊",
    "winnerPct": 27.6,
    "totalVotes": 29
  },
  {
    "question": "一番正直すぎて損しそうな人は誰?",
    "choices": [
      "寺岡 賢甫",
      "山内 侑大",
      "岩田 康孝",
      "高山 莞寧"
    ],
    "choicesPct": [
      6.9,
      10.3,
      55.2,
      6.9
    ],
    "choicesCount": [
      2,
      3,
      16,
      2
    ],
    "correct": 3,
    "winner": "岩田 康孝",
    "winnerPct": 55.2,
    "totalVotes": 29
  },
  {
    "question": "一番ミステリアスな人は誰?",
    "choices": [
      "曾我部 哲平",
      "河野 天智",
      "築池 康平",
      "谷口 夢生"
    ],
    "choicesPct": [
      13.8,
      17.2,
      6.9,
      20.7
    ],
    "choicesCount": [
      4,
      5,
      2,
      6
    ],
    "correct": 4,
    "winner": "谷口 夢生",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "一番食べる量が多い人は誰?",
    "choices": [
      "的場 勇都",
      "谷口 夢生",
      "高山 莞寧",
      "染川 凛"
    ],
    "choicesPct": [
      24.1,
      17.2,
      13.8,
      17.2
    ],
    "choicesCount": [
      7,
      5,
      4,
      5
    ],
    "correct": 1,
    "winner": "的場 勇都",
    "winnerPct": 24.1,
    "totalVotes": 29
  },
  {
    "question": "お弁当が一番豪華な人は誰?",
    "choices": [
      "圖師 陽杜",
      "有村 涼雅",
      "高山 莞寧",
      "安達 太陽"
    ],
    "choicesPct": [
      6.9,
      10.3,
      13.8,
      13.8
    ],
    "choicesCount": [
      2,
      3,
      4,
      4
    ],
    "correct": 3,
    "winner": "高山 莞寧",
    "winnerPct": 13.8,
    "totalVotes": 29
  },
  {
    "question": "一番辛い食べ物が好きな人は誰?",
    "choices": [
      "安達 太陽",
      "甲斐 黄純",
      "有村 涼雅",
      "加藤 希空丸"
    ],
    "choicesPct": [
      27.6,
      6.9,
      6.9,
      10.3
    ],
    "choicesCount": [
      8,
      2,
      2,
      3
    ],
    "correct": 1,
    "winner": "安達 太陽",
    "winnerPct": 27.6,
    "totalVotes": 29
  },
  {
    "question": "一番甘い食べ物が好きな人は誰?",
    "choices": [
      "中田 凜",
      "高山 莞寧",
      "安達 太陽",
      "加世田 湊"
    ],
    "choicesPct": [
      10.3,
      20.7,
      10.3,
      13.8
    ],
    "choicesCount": [
      3,
      6,
      3,
      4
    ],
    "correct": 2,
    "winner": "高山 莞寧",
    "winnerPct": 20.7,
    "totalVotes": 29
  },
  {
    "question": "一番お金持ちになりそうな人は誰?",
    "choices": [
      "岩田 康孝",
      "徳田 太祐",
      "石井 貴哉",
      "加世田 湊"
    ],
    "choicesPct": [
      17.2,
      24.1,
      6.9,
      17.2
    ],
    "choicesCount": [
      5,
      7,
      2,
      5
    ],
    "correct": 2,
    "winner": "徳田 太祐",
    "winnerPct": 24.1,
    "totalVotes": 29
  },
  {
    "question": "10年後も一番変わっていなさそうな人は誰?",
    "choices": [
      "高山 莞寧",
      "岩田 康孝",
      "有村 涼雅",
      "黒木 碧"
    ],
    "choicesPct": [
      10.3,
      13.8,
      10.3,
      10.3
    ],
    "choicesCount": [
      3,
      4,
      3,
      3
    ],
    "correct": 2,
    "winner": "岩田 康孝",
    "winnerPct": 13.8,
    "totalVotes": 29
  },
  {
    "question": "10年後に一番変わっていそうな人は誰?",
    "choices": [
      "黒木瑛汰",
      "黒木 碧",
      "中田 凜",
      "谷口 夢生"
    ],
    "choicesPct": [
      6.9,
      10.3,
      6.9,
      10.3
    ],
    "choicesCount": [
      2,
      3,
      2,
      3
    ],
    "correct": 2,
    "winner": "黒木 碧",
    "winnerPct": 10.3,
    "totalVotes": 29
  },
  {
    "question": "一番クラスのみんなと連絡を取り続けていそうな人は誰?",
    "choices": [
      "徳田 太祐",
      "加世田 湊",
      "岩田 康孝",
      "安達 太陽"
    ],
    "choicesPct": [
      17.2,
      24.1,
      20.7,
      17.2
    ],
    "choicesCount": [
      5,
      7,
      6,
      5
    ],
    "correct": 2,
    "winner": "加世田 湊",
    "winnerPct": 24.1,
    "totalVotes": 29
  },
  {
    "question": "一番このクラスのことを忘れなさそうな人は誰?",
    "choices": [
      "木浦 翔太",
      "加世田 湊",
      "徳田 太祐",
      "岩田 康孝"
    ],
    "choicesPct": [
      6.9,
      34.5,
      6.9,
      20.7
    ],
    "choicesCount": [
      2,
      10,
      2,
      6
    ],
    "correct": 2,
    "winner": "加世田 湊",
    "winnerPct": 34.5,
    "totalVotes": 29
  },
  {
    "question": "修学旅行のしおりを一番ちゃんと読んでいそうな人は誰?",
    "choices": [
      "黒木 碧",
      "甲斐 琉捺",
      "加世田 湊",
      "岩田 康孝"
    ],
    "choicesPct": [
      10.3,
      24.1,
      10.3,
      20.7
    ],
    "choicesCount": [
      3,
      7,
      3,
      6
    ],
    "correct": 2,
    "winner": "甲斐 琉捺",
    "winnerPct": 24.1,
    "totalVotes": 29
  },
  {
    "question": "PCの操作が一番速い人は誰?",
    "choices": [
      "",
      "徳田 太祐",
      "岩田 康孝",
      "圖師 陽杜"
    ],
    "choicesPct": [
      0.0,
      79.3,
      17.2,
      3.4
    ],
    "choicesCount": [
      0,
      23,
      5,
      1
    ],
    "correct": 2,
    "winner": "徳田 太祐",
    "winnerPct": 79.3,
    "totalVotes": 29
  },
  {
    "question": "早弁をしている人といえば誰?",
    "choices": [
      "的場 勇都",
      "高山 莞寧",
      "西田 頼寿",
      "安達 太陽"
    ],
    "choicesPct": [
      13.8,
      10.3,
      27.6,
      24.1
    ],
    "choicesCount": [
      4,
      3,
      8,
      7
    ],
    "correct": 3,
    "winner": "西田 頼寿",
    "winnerPct": 27.6,
    "totalVotes": 29
  },
  {
    "question": "テストの時に「今回勉強してないわー」と言っているのに実際はしっかり勉強していそうな人はだれ?",
    "choices": [
      "黒木瑛汰",
      "山本 泰綺",
      "甲斐 黄純",
      "加藤 希空丸"
    ],
    "choicesPct": [
      6.9,
      10.3,
      17.2,
      13.8
    ],
    "choicesCount": [
      2,
      3,
      5,
      4
    ],
    "correct": 3,
    "winner": "甲斐 黄純",
    "winnerPct": 17.2,
    "totalVotes": 29
  }
];

// クイズマネージャー
const QuizMgr = {
  quizList: [],
  currentIndex: 0,
  currentQuiz: null,
  isActive: false,
  answered: false,

  init() {
    this.quizList = [...QuizData].sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    this.currentQuiz = null;
    this.isActive = false;
    this.answered = false;
  },

  hasNext() {
    return this.currentIndex < this.quizList.length;
  },

  next() {
    if (!this.hasNext()) return null;
    this.currentQuiz = this.quizList[this.currentIndex];
    this.currentIndex++;
    this.isActive = true;
    this.answered = false;
    return this.currentQuiz;
  },

  checkAnswer(laneNum) {
    if (!this.currentQuiz || this.answered) return null;
    this.answered = true;
    this.isActive = false;
    return laneNum === this.currentQuiz.correct;
  },

  getTotalCount() {
    return this.quizList.length;
  }
};
