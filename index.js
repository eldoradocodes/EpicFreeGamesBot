const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const epic = require('./epicstore/EpicGamesApi');

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		//GatewayIntentBits.MessageContent,
		//GatewayIntentBits.GuildMembers,
		//GatewayIntentBits.GuildMessageReactions,
	],
});

client.once(Events.ClientReady, (c) => {
	console.log(`Ready, logged in as user ${c.user.tag}`);
});

// client.on(Events.MessageCreate, (e) => {
// 	e.guild.channels.fetch('1132796020384878762').then((channel) => {
// 		epic.getFreeGames().then((freeGames) => {
// 			channel.send(`${freeGames}`);
// 		});
// 	});
// });

client.login(process.env.DISCORD_TOKEN);

client.commands = new Collection();

// Get all command files in the commands folder
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.log(
			`No command matching ${interaction.commandName} was found.`
		);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
});
