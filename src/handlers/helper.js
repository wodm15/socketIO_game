import { CLIENT_VERSION } from '../constants.js';
import { getUsers, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
}; 


export const handleConnection = (socket, userUUID) => {
    console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
    console.log('Current users:', getUsers());
  
    // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
    const { stages } = getGameAssets();

    setStage(userUUID, stages.data[0].id);

    console.log('Stage:', getStage(userUUID));
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
    
    const response= handler(data.userId, data.payload);

    if(response.broadcast){
        io.emit('response','broadcast');
        return;
    }
    socket.emit('response',response);
}