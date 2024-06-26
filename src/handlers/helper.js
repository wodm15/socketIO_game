import { CLIENT_VERSION } from '../constants.js';
import { getUsers, removeUser} from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';
import {highScoreHandler} from '../handlers/highScore.handler.js';
import { io } from '../init/socket.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
}; 


export const handleConnection = (socket, userUUID) => {
    console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
    console.log('Current users:', getUsers());
  
    createStage(userUUID);  // 스테이지 빈 배열 생성
    socket.emit('connection', { uuid: userUUID });

  };

export const handlerEvent = (id, socket, data) =>{
    if(!CLIENT_VERSION.includes(data.clientVersion)){
        socket.emit('response',{status: "fail" , message:"Client version mismatch"});
        return;
    }

    const handler = handlerMappings[data.handlerId];
    if(!handler) {
        socket.emit('response', {status: "fail",message: "Handler not found"})
        return;
    }
  // handler가 highscore 갱신일 경우
  if (data.handlerId === 12) {
    const highscore = data.payload;
    io.emit('highScoreUpdate', { highScore: highscore });
  }

    
    const response= handler(data.userId, data.payload);

    if(response.broadcast){
        io.emit('response','broadcast');
        return;
    }
    socket.emit('response',response);
}