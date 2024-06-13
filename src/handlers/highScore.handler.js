

export const highScoreHandler = (uuid,payload) =>{
    const HIGH_SCORE_KEY = payload;
    const HIGH_SCORE_USER = uuid;
    console.log(HIGH_SCORE_KEY);
    return {status: 'highScore upload sucess'};
};
