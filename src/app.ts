// Suggestion bot v2.0.0
// Written by VikingTheDev for use in Sunshine State Roleplay

// TODO: Add a method called init to the API Class that adds all commands and sets up perms.

/** TODO:
 *   - Finish the database class to allow for reading and writing to a 
 *     JSON file, adding new entries in accordence to the constructor, 
 *     and getting the length of the "DB"
 *   - Rewrite api.ts and commands.ts to a single class with methods
 *     for interacting with commands, messages and permissions
 *     (probably more to come). Will also need methods for sending (and
 *     altering) the embed to another channel uppon approval/denial.
 *   - Move command handelers to cmd_handlers.ts and make it a class.
 *   - Add new commands and add their command handlers to the class.
 *     Commands needed: (probably more to come)
 *        - new type suggestion links(optional)
 *        - approve id
 *        - deny id
 *        - in-progress id
 *        - implemented id
 *        - delete id
 *        - config
 *            - set-channel suggestions||approved||denied||in-progress||implemented||all channel
 *            - perms
 *                - add user||role command
 *                - remove user||role command
 */


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