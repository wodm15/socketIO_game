import { sendEvent } from './Socket.js'; 
import { fetchAssets } from './assetImport.js';
import {socket} from './Socket.js';

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
    fetchAssets().then(assetData => {
      this.stages = assetData.stages;
      this.items = assetData.items;

      for (let i = 0; i < this.stages.data.length; i++) {
        if (this.currentStageIndex + 999 === this.stages.data[i].id) {
          this.score += deltaTime * 0.001 * this.stages.data[i].scorePerSecond;
        }
      }

      for (let i = this.currentStageIndex; i < this.stages.data.length; i++) {
        if (Math.floor(this.score) >= this.stages.data[i].score) {
          sendEvent(11, { currentStage: this.stages.data[i - 1].id, targetStage: this.stages.data[i].id });
          this.currentStageIndex = i + 1;
        }
      }
    });
  }

  getItem(itemId) {
    const currentTime = Date.now();

    if (!this.items || !Array.isArray(this.items.data)) {
      console.log('Assets not loaded properly.');
      return;
    }

    const item = this.items.data.find(item => item.id === itemId);

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
      for (let i = 0; i < this.items.data.length; i++) {
        if (itemId === this.items.data[i].id) {
          this.score += this.items.data[i].score;
          console.log(`${this.items.data[i].score} 추가 획득`);
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
      console.log('최고기록 갱신');
      socket.emit('최고기록 갱신', { score: Math.floor(this.score) });
      sendEvent(12, { score: Math.floor(this.score) });
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
