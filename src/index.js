const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent,
        // GatewayIntentBits.GuildMembers,
        // GatewayIntentBits.GuildMessageReactions,
    ],
});

client.commands = new Collection();

// Get all command files in the commands folder
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[INFO] Loaded command: ${file}`);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventsFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
        console.log('[INFO] Loaded events');
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// No token defined, quit
if (!process.env.DISCORD_TOKEN) throw new Error('API Token not defined.');

client.login(process.env.DISCORD_TOKEN);
