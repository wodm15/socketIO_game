

export const highScoreHandler = (uuid,payload) =>{
    const HIGH_SCORE_KEY = payload;
    const HIGH_SCORE_USER = uuid;
    return {status: 'highScore upload sucess'};
};
