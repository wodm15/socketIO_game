import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {

    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });
    
    // 접속시 유저 정보 생성 이벤트 처리
    handleConnection(socket, userUUID);

    socket.on('event', (data) => handlerEvent(io,socket,data));
    
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
