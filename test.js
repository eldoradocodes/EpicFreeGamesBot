const epic = require('./epicstore/EpicGamesApi');

const getGames = async () => {
    const games = [];
    const freeGames = await epic.getFreeGames();

    return freeGames;
};

const returnGame = async () => console.log(await getGames());

returnGame();
