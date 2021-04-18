// Suggestion bot v2.0
// Written by VikingTheDev

import DiscordJS, { BaseClient } from "discord.js";
const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'USER', 'GUILD_MEMBER']
});
import * as config from "./config.json";

const guildId = config.bot.guildID;
const getApp = (guildId: string) => {
    // @ts-ignore
    let app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

client.on('ready', async () => {
    console.log(`I'm online, my name is ${client.user!.username}`);
    client.user!
        .setActivity('your suggestions', { type: "WATCHING" })
        .catch(console.error);
    
    // @ts-ignore
    const commands = await getApp(guildId).commands.get()
    console.log(commands)
    
    // define a new slash command in the guild
    await getApp(guildId).commands.post({
        data: {
            name: 'new',
            description: 'Create a new suggestion',
            options: [
                {
                    name: 'Type',
                    description: 'Specify what type of suggestion this is',
                    required: true,
                    type: 3, // string
                    choices: [
                        {
                            name: 'Discord',
                            value: 'discord',
                        },
                        {
                            name: 'In-game',
                            value: 'in-game',
                        },
                        {
                            name: 'Department',
                            value: 'department'
                        }
                    ]
                },
                {
                    name: 'Suggestion',
                    description: "Describe your suggestion. Please provide any relevant links",
                    required: true,
                    type: 3, // string
                },
            ]
        } 
    })

    
    // Code to delete a slash command, replace numbers with application ID
    //await getApp(guildId).commands('833299535886942209').delete()
    
    // @ts-ignore
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data;
        const command = name.toLowerCase();
        
        const args: any = {}

        if (options) {
            for (const option of options) {
                const { name, value } = option;
                // @ts-ignore
                args[name] = value;
            }
        }

        console.log(args)

        if (command === 'new') {
        const embed = new DiscordJS.MessageEmbed()
            .setTitle(`${interaction.member.user.username} made a ${args.type} suggestion:`)
            .setDescription(args.suggestion)
            .setFooter('Made by VikingTheDev © 2021')
            .setTimestamp()
            .addField("Status: ", "Awaiting review")
        reply(interaction, embed)
        }
    })
});

const reply = async (interaction: object, response: string | object) => { 
    let data: any = {
        content: response
    }

    // Check for embeds
    if(typeof response === 'object') {
        data = await createAPIMessage(interaction, response);
    };

    // @ts-ignore
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data,
        }
    })
}

const createAPIMessage = async (interaction: any, content: any) => {
    const { data, files } = await DiscordJS.APIMessage.create(
        // @ts-ignore
        client.channels.resolve(interaction.channel_id),
        content
    )
        .resolveData()
        .resolveFiles()
    
    return { ...data, files }
}

client.on('messageReactionAdd', (reaction, user) => {
    console.log(reaction, user);
})

client.login(config.bot.token);