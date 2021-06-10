// Suggestion bot v2.0.0
// Written by VikingTheDev

// Import helper functions
const { 
    getApp,
    editPermissions,
    reply,
    defer,
    editDefer,
    createAPIMessage,
} = require('./helpers/api');
const { updateCmds, getCmds, getPerms } = require("./helpers/commands");

// Import DiscordJS and set up the bot
import DiscordJS, {BaseClient} from "discord.js";
const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'USER', 'GUILD_MEMBER']
}); 

// Import the config file
import * as config from "./config.json";
const guildId = config.bot.guildID;

client.on('ready', async () => {
    console.log(`I'm online, my name is ${client.user!.username}`);
    client.user!
        .setActivity('your suggestions', { type: "WATCHING" })
        .catch(console.error);
    

    // @ts-ignore
    updateCmds(client, guildId);

    // edit permissions for a command
    // editPermissions(client, guildId, '851865111671996476', [
    //     {
    //         id: '767803636926906419',
    //         type: 1,
    //         permission: true,
    //     }
    // ])

    // Get perms for a role
    //console.log(await getPerms(client, guildId, '851865111671996476'))

    // Get all commands in a guild
    //console.log(await getCmds(client, guildId));
    
    // @ts-ignore
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data;
        let command;
        if (name) {
            command = name.toLowerCase();
        }
        

        if (command === 'suggestion') {
            const args: any = {}

            for (const option of options[0].options) {
                const { name, value } = option;
                args[name] = value;
            }
            console.log(interaction)
            
            defer(client, interaction);
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
                

                let data = await createAPIMessage(client, interaction, embed);
                // @ts-ignore
                await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
                    data
                })
            }, 2000)
        }
    })
});


client.login(config.bot.token);