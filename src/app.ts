// Suggestion bot v2.0.0
// Written by VikingTheDev for use in Sunshine State Roleplay

// TODO: Finish command handelers


// Import helper functions
import { API } from "./classes/api";
import { jsonDB } from "./db/database";

// Import DiscordJS and set up the bot
import DiscordJS, { BaseClient } from "discord.js";
const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'USER', 'GUILD_MEMBER']
});

// Import the config file
import config from "./config"
const guildId = config.bot.guildID;

const api = new API(client, guildId);


client.on('ready', async () => {
    console.log(`I'm online, my name is ${client.user!.username}`);
    client.user!
        .setActivity('your suggestions', { type: "WATCHING" })
        .catch(console.error);


    await api.init(); 


    // @ts-ignore
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { options, name, channel_id } = interaction.data;

        let command = name.toLowerCase();

        if (command === 'new') {
            const args: any = {}

            for (const option of options) {
                const { name, value } = option;
                args[name] = value;
            }
            
            api.interaction(interaction).defer();
            setTimeout( async ()  => {
                const embed = new DiscordJS.MessageEmbed()
                    .setTitle(`${interaction.member.user.username} made a new suggestion:`)
                    .setFooter('Made by VikingTheDev © 2021')
                    .setTimestamp()
                    .addField('Suggestion: ', args.suggestion)
                    if (args.links) {
                        embed.addField('Links: ', args.links)
                    }
                    embed.addFields( 
                        { name: "Status: ", value: "Awaiting review", inline: true },
                        { name: 'Type', value: args.type, inline: true },
                        { name: 'ID:', value: 4, inline: true }
                    )
                

                let data = await api.createAPIMessage(interaction, embed);
                // @ts-ignore
                await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
                    data
                })
            }, 2000)
        }
    })
});

client.login(config.bot.token);