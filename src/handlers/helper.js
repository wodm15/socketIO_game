import { getUsers, removeUser } from '../models/user.model.js';

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
    // stages 배열에서 0번째 = 첫번째스테이지 의 ID를 해당 유저의 stage에 저장한다.
    setStage(userUUID, stages.data[0].id);
    // 로그를 찍어 확인.
    console.log('Stage:', getStage(userUUID));
  
    // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
    // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다.
    socket.emit('connection', { uuid: userUUID });
  };