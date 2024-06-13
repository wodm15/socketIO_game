import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

let io; // 전역 변수로 설정

const initSocket = (server) => {
  io = new SocketIO();
  io.attach(server);

  // 클라이언트로부터 오는 이벤트를 처리할 핸들러를 서버에 등록
  registerHandler(io);
};

export { io }; // io를 export
export default initSocket;
