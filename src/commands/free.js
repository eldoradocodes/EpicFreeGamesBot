const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const epic = require('../epicstore/EpicGamesApi');

const gamesList = async () => {
    const gameArray = [];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const freeGames = await epic.getFreeGames();

    freeGames.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    for (const game in freeGames) {
        const embed = new EmbedBuilder()
            .setColor(0xef7b45)
            .setTitle(`${freeGames[game].game}`)
            .setURL(freeGames[game].url)
            .setThumbnail(freeGames[game].thumbnail)
            .setDescription(`${freeGames[game].description}`)
            .setFooter({
                text: `Valid: ${new Date(freeGames[game].start_date).toLocaleDateString(
                    undefined,
                    options
                )} to ${new Date(freeGames[game].end_date).toLocaleDateString(undefined, options)}`,
            });
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
