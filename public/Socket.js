import { CLIENT_VERSION } from './Constants.js';

export const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

// 높은 점수 서버에서 받기
let highScoreUpdate = null;
socket.on('highScoreUpdate', (data) => {
  highScoreUpdate = data;
  console.log('High score updated:', highScoreUpdate.highScore);
});


//이벤트 전송 함수
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent} ;