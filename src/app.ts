// Suggestion bot v2.0.0
// Written by VikingTheDev for use in Sunshine State Roleplay

// TODO: Finish command handlers. Consider how the database should be done 
// TODO (to minimize file size rewriting CreateAPIMessage() to accepting an 
// TODO interaction OR a channel ID would be needed.)


// Import helper functions
import { API } from "./helpers/api";
import { commandHandler } from "./helpers/cmd_handlers";

// Import DiscordJS and set up the bot
import DiscordJS, { MessageEmbed } from "discord.js";
export const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'USER', 'GUILD_MEMBER']
});

// Import the config file
import config from "./config"
const guildId = config.bot.guildID;

export const api = new API(client, guildId);


client.on('ready', async () => {
    console.log(`I'm online, my name is ${client.user!.username}`);
    client.user!
        .setActivity('your suggestions', { type: "WATCHING" })
        .catch(console.error);


    await api.init();

    // @ts-ignore
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        commandHandler(interaction);
    })
});

client.login(config.bot.token);