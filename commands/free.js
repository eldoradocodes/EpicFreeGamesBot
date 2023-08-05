const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const epic = require('../epicstore/EpicGamesApi');

const gamesList = async () => {
    const gameArray = [];
    const freeGames = await epic.getFreeGames();

    for (const game in freeGames) {
        const embed = new EmbedBuilder()
            .setColor(0xee4266)
            .setTitle(`${freeGames[game].game}`)
            .addFields({ name: `${freeGames[game].game}`, value: 'Some value here', inline: true });

        gameArray.push(embed);
    }

    return gameArray;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('free')
        .setDescription('Get the list of free games from the Epic Games Store.'),
    async execute(interaction) {
        await interaction.reply({ embeds: await gamesList() });
    },
};
