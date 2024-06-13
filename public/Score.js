import { sendEvent } from './Socket.js';
import { fetchAssets } from './assetImport.js';

let stages, items;

fetchAssets().then(assetData => {
  stages = assetData.stages;
  items = assetData.items;
});

class Score {
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.score = 0;
    this.HIGH_SCORE_KEY = 'highScore';
    this.stageChange = true;
    this.currentStageIndex = 1;
    this.itemTimestamps = {};
  }

  update(deltaTime) {
    for (let i = 0; i < stages.data.length; i++) {
      if (this.currentStageIndex + 999 === stages.data[i].id) {
        this.score += deltaTime * 0.001 * stages.data[i].scorePerSecond;
      }
    }

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

    if (!this.itemTimestamps[itemId]) {
      this.itemTimestamps[itemId] = [];
    }

    this.itemTimestamps[itemId].push(currentTime);

    this.itemTimestamps[itemId] = this.itemTimestamps[itemId].filter(
      timestamp => currentTime - timestamp <= 10000
    );

    if (this.itemTimestamps[itemId].length > 5) {
      return { status: 'fail', message: 'you are a hack' };
    } else {
      for (let i = 0; i < items.data.length; i++) {
        if (itemId === items.data[i].id) {
          this.score += items.data[i].score;
          console.log(`${items.data[i].score} 추가 획득`);
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
