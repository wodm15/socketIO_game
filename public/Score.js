import { sendEvent } from './Socket.js';

const stages = {
  "name": "stage",
  "version": "1.0.0",
  "data": [
    { "id": 1000, "score": 0, "scorePerSecond": 1 },
    { "id": 1001, "score": 10, "scorePerSecond": 2 },
    { "id": 1002, "score": 15, "scorePerSecond": 4 },
    { "id": 1003, "score": 300, "scorePerSecond": 8 },
    { "id": 1004, "score": 400, "scorePerSecond": 16 },
    { "id": 1005, "score": 500, "scorePerSecond": 32 },
    { "id": 1006, "score": 600, "scorePerSecond": 64 }
  ]
};

const items = {
  "name": "item",
  "version": "1.0.0",
  "data": [
    { "id": 1, "score": 10, "interval": 10 },
    { "id": 2, "score": 20, "interval": 10 },
    { "id": 3, "score": 30, "interval": 10 },
    { "id": 4, "score": 40, "interval": 10 },
    { "id": 5, "score": 50, "interval": 10 },
    { "id": 6, "score": 60, "interval": 10 }
  ]
};

class Score {
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.score = 0;
    this.HIGH_SCORE_KEY = 'highScore';
    this.stageChange = true;
    this.currentStageIndex = 1; // 스테이지 1부터 시작
    this.itemTimestamps = {}; // 아이템 획득 타임스탬프 기록
  }

  update(deltaTime) {
    // 스테이지마다 점수 계산 다르게 변경
    for (let i = 0; i < stages.data.length; i++) {
      if (this.currentStageIndex + 999 === stages.data[i].id) {
        this.score += deltaTime * 0.001 * stages.data[i].scorePerSecond;
      }
    }

    // 전체 돌아서 score와 this score가 같아지면 sendEvent를 보낸다.
    for (let i = this.currentStageIndex; i < stages.data.length; i++) {
      if (Math.floor(this.score) >= stages.data[i].score) {
        sendEvent(11, { currentStage: stages.data[i - 1].id, targetStage: stages.data[i].id });
        this.currentStageIndex = i + 1;
      }
    }
  }

  getItem(itemId) {
    const currentTime = Date.now();
    const item = items.data.find(item => item.id === itemId);

    if (!item) {
      console.log(`Item with id ${itemId} not found.`);
      return;
    }
    
    // 타임스탬프 기록이 없으면 초기화
    if (!this.itemTimestamps[itemId]) {
      this.itemTimestamps[itemId] = [];
    }

    // 현재 시간 기록
    this.itemTimestamps[itemId].push(currentTime);

    // 최근 10초 이내의 타임스탬프만 남기기
    this.itemTimestamps[itemId] = this.itemTimestamps[itemId].filter(
      timestamp => currentTime - timestamp <= 10000
    );

    // 어뷰징 검증
    if (this.itemTimestamps[itemId].length > 5) {
      console.log(`User is abusing item ${itemId}.`);
    } else {
          //item 아이디에 따라 점수가 다름
          for (let i = 0 ; i<items.data.length; i++){
          if(itemId === items.data[i].id){
          this.score += items.data[i].score
          console.log(`${items.data[i].score} 추가 획득` )
      }
    }
      console.log(`현재 점수: ${this.score}`);
    }
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
