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
    getApp(guildId).commands.post({
        data: {
            name: 'test',
            description: 'Test for deferrals and permissions',
            type: 2, // sub-command group
            options: [
                {
                    name: 'new',
                    description: 'Create new thing',
                    type: 1,
                    options: [
                        {
                            name: 'Type',
                            description: 'Type of thing you want to create',
                            type: 3,
                            required: true,
                            choices: [
                                {
                                    name: 'Cool thing',
                                    value: 'cool_thing'
                                },
                                {
                                    name: 'Kinda cool thing',
                                    value: 'kinda_cool_thing'
                                },
                                {
                                    name: 'Uncool thing',
                                    value: 'uncool_thing'
                                }
                            ]
                        },
                        {
                            name: 'Content',
                            description: 'Content used to create new thing',
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: 'Edit thing',
                    type: 1,
                    options: [
                        {
                            name: 'ID',
                            description: 'ID of thing you want to edit',
                            required: true,
                            type: 3 // string
                        },
                        {
                            name: 'Content',
                            description: 'New content to replace old content with',
                            required: true,
                            type: 3
                        }
                    ]
                },
                {
                    name: 'edit',
                    description: 'Delete thing',
                    type: 1,
                    options: [
                        {
                            name: 'ID',
                            description: 'ID of thing you want to delete',
                            required: true,
                            type: 3 // string
                        }
                    ]
                }
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

        // Might make a class instead to accommodate for sub-commands
        
        console.log(interaction.id, interaction.data.id)

        //console.log(interaction)
        
        // This is apparently how to access the options when using sub-commands ¯\_(ツ)_/¯

        if (command === 'new') {
            if (options) {
                for await (const option of options) {
                    const { name, value } = option;
                    args[name] = value;
                }
            }
            const embed = new DiscordJS.MessageEmbed()
                .setTitle(`${interaction.member.user.username} made a ${args.type} suggestion:`)
                .setDescription(args.suggestion)
                .setFooter('Made by VikingTheDev © 2021')
                .setTimestamp()
                .addField("Status: ", "Awaiting review")
            reply(interaction, embed)
        } else if (command === 'test') {
            if (options) {
                for (const option of options[0].options) {
                    const { name, value } = option;
                    args[name] = value;
                }
                console.log(options[0].name, args);
                switch (true) {
                    case options[0].name === 'new': 
                        defer(interaction);
                        // @ts-ignore
                        await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
                            data: {
                                content: 'Test'
                            }
                        })
                        // setTimeout(() => {
                        //     reply(interaction, 'Thing is too large!');
                        // }, 5000)
                        break;
                    case options[0].name === 'edit': 
                        break;
                    case options[0].name === 'delete':
                        defer(interaction);
                        break;
                }
            }
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

const defer = async (interaction: object) => {
    // @ts-ignore
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 5,
        }
    })
}

const editDefer = async (interaction: object, response: string | object) => {
    // @ts-ignore
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