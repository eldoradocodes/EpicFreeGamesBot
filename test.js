const epic = require('./epicstore/EpicGamesApi');
const { EGS_URL } = require('./utils/constants');

const getGames = async () => {
	const freeGames = await epic.getFreeGames();

	for (g of freeGames) {
		console.log(g.game);
	}
};

getGames();
