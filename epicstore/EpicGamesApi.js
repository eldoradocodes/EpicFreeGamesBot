const https = require('node:https');
const { EGS_URL } = require('../utils/constants');

function getFreeGames() {
	return new Promise((resolve, reject) => {
		let free_games = [];
		https.get(EGS_URL, (res) => {
			let data = [];

			res.on('data', (d) => {
				data.push(d);
			});

			res.on('end', () => {
				const games = JSON.parse(Buffer.concat(data).toString());

				for (game of games.data.Catalog.searchStore.elements) {
					if (game.promotions) {
						if (game.promotions.promotionalOffers.length === 0) {
							free_games.push({
								game: game.title,
								start_date:
									game.promotions.upcomingPromotionalOffers[0]
										.promotionalOffers[0].startDate,
								end_date:
									game.promotions.upcomingPromotionalOffers[0]
										.promotionalOffers[0].endDate,
							});
						} else {
							free_games.push({
								game: game.title,
								start_date:
									game.promotions.promotionalOffers[0]
										.promotionalOffers[0].startDate,
								end_date:
									game.promotions.promotionalOffers[0]
										.promotionalOffers[0].endDate,
							});
						}
					}
				}

				resolve(free_games);
			});

			res.on('error', (e) => reject(e));
		});
	});
}

exports.getFreeGames = getFreeGames;
