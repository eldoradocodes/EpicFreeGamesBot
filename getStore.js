const https = require('node:https');

https.get(
	'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US',
	(res) => {
		let data = [];
		console.log('Status Code: ', res.statusCode);

		res.on('data', (d) => {
			data.push(d);
		});

		res.on('end', () => {
			const games = JSON.parse(Buffer.concat(data).toString());

			// console.log(
			// 	games.data.Catalog.searchStore.elements[0].promotions
			// 		.promotionalOffers[0]
			// );

			for (game of games.data.Catalog.searchStore.elements) {
				if (game.promotions) {
					console.log('TITLE:', game.title);

					if (game.promotions.promotionalOffers.length === 0)
						console.log(
							game.promotions.upcomingPromotionalOffers[0]
								.promotionalOffers[0]
						);

					// for (promotion of game.promotions.promotionalOffers) {
					// 	console.log(promotion);
					// }
				}
			}
		});
	}
);
