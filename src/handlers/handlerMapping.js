import { moveStageHandler } from '../handlers/stage.handller.js'
import { gameEnd, gameStart } from './game.handler.js';



const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,

};

export default handlerMappings;