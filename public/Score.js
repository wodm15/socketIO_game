import { sendEvent } from './Socket.js';

const stages = 
{
  "name": "stage",
  "version": "1.0.0",
  "data": [
    { "id":  1000, "score": 0, "scorePerSecond": 1 },
    { "id":  1001, "score": 10, "scorePerSecond": 2 },
    { "id":  1002, "score": 15, "scorePerSecond": 4 },
    { "id":  1003, "score": 300, "scorePerSecond": 8 },
    { "id":  1004, "score": 400, "scorePerSecond": 16 },
    { "id":  1005, "score": 500, "scorePerSecond": 32 },
    { "id":  1006, "score": 600, "scorePerSecond": 64 }
  ]
}
const item = 
{
  "name": "item",
  "version": "1.0.0",
  "data": [
    { "id":  1, "score": 10 },
    { "id":  2, "score": 20 },
    { "id":  3, "score": 30 },
    { "id":  4, "score": 40 },
    { "id":  5, "score": 50 },
    { "id":  6, "score": 60 }
  ]
}

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;    //스테이지 변경시 트리거
  currentStageIndex = 1; //스테이지 1부터 시작

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {

    //스테이지마다 점수계산 다르게 변경
    for (let i=0; i <stages.data.length ; i++){
      if(this.currentStageIndex +999 === stages.data[i].id){
        this.score += deltaTime * 0.001 * stages.data[i].scorePerSecond;
      }
    }

    // console.log(this.stageChange);
    
  // 전체 돌아서 score 과 this score 이 같아지면 sendEvent를 보낸다.

  for (let i = this.currentStageIndex ; i < stages.data.length; i++) {
    if (Math.floor(this.score) >= stages.data[i].score) {
      sendEvent(11, { currentStage: stages.data[i - 1].id, targetStage: stages.data[i].id });
      this.currentStageIndex = i+1;
    }
  }
}

  //item 아이디에 따라 점수가 다름
  getItem(itemId) {
    for (let i = 0 ; i<item.data.length; i++){
      if(itemId === item.data[i].id){
        this.score += item.data[i].score
      }
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