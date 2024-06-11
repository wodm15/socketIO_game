import { moveStageHandler } from "./stage.handller";

const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    11: moveStageHandler,
};

export default handlerMappings;