const epic = require('./epicstore/EpicGamesApi');

const getGames = async () => {
    const freeGames = await epic.getFreeGames();

    freeGames.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    return freeGames;
};

const returnGame = async () => console.log(await getGames());

returnGame();
