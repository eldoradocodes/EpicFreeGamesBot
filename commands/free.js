const { SlashCommandBuilder } = require('discord.js');
const epic = require('../epicstore/EpicGamesApi');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('free')
		.setDescription(
			'Get the list of free games from the Epic Games Store.'
		),
	async execute(interaction) {
		const freeGames = await epic.getFreeGames();

		for (game of freeGames) {
			await interaction.reply(game.game);
		}
	},
};
