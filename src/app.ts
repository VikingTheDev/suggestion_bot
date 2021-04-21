// Suggestion bot v2.0.0
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

const editPermissions = (guildId: string, commandId: string, data: object) => {
    // @ts-ignore
    let command = client.api.applications(client.user.id).guilds(guildId).commands(commandId);
    command.permissions.put({
        data: {
            permissions: [
                {
                    id: '767803636926906419',
                    type: 1, // 1 == role, 2 == user
                    permission: true
                }
            ]   
        }
    })
}

client.on('ready', async () => {
    console.log(`I'm online, my name is ${client.user!.username}`);
    client.user!
        .setActivity('your suggestions', { type: "WATCHING" })
        .catch(console.error);
    
    // @ts-ignore
    const commands = await getApp(guildId).commands.get()
    console.log(commands)

    // @ts-ignore
    const perms = await client.api.applications(client.user.id).guilds(guildId).commands('834327111384563724').permissions.get()
    console.log(perms)
    
    // define a new slash command in the guild
    getApp(guildId).commands.post({
        data: {
            name: 'test',
            description: 'Test for deferrals and permissions',
            type: 2, // sub-command group
            options: [
                {
                    name: 'new',
                    description: 'Create new thing',
                    type: 1, // sub-command
                    options: [
                        {
                            name: 'Type',
                            description: 'Type of thing you want to create',
                            type: 3, // string
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
                            type: 3, // string
                            required: true
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: 'Edit thing',
                    type: 1, // sub-command
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
                            type: 3 // string
                        }
                    ]
                },
                {
                    name: 'edit',
                    description: 'Delete thing',
                    type: 1, // sub-command
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

    getApp(guildId).commands.post({
        data: {
            name: 'suggestion',
            description: 'All suggestion related commands', 
            type: 2,
            default_permission: false,
            options: [
                {
                    name: 'new',
                    type: 1,
                    description: 'Create a new suggestion', 
                    options: [
                        {
                            name: 'Type',
                            type: 3,
                            description: 'Type of suggestion',
                            required: true,
                            choices: [
                                {
                                    name: 'Discord',
                                    value: 'discord'
                                },
                                {
                                    name: 'In-game',
                                    value: 'ingame'
                                },
                                {
                                    name: 'Department',
                                    value: 'department'
                                }
                            ]
                        },
                        {
                            name: 'Suggestion',
                            type: 3,
                            description: 'Describe your suggestion.',
                            required: true
                        },
                        {
                            name: 'Channel',
                            type: 7,
                            description: 'Channel to post suggestion in',
                            required: true
                        }
                    ]
                }
            ]
        }
    })

    
    // Code to delete a slash command, replace numbers with ID ( !! Not application ID !!)
    // await getApp(guildId).commands('834319699025199134').delete()
    
    // @ts-ignore
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data;
        const command = name.toLowerCase();
        
        const args: any = {}

        // Might make a class instead to accommodate for sub-commands

        //console.log(interaction)

        if (command === 'new') {
            if (options) {
                for (const option of options) {
                    const { name, value } = option;
                    args[name] = value;
                }
                const embed = new DiscordJS.MessageEmbed()
                    .setTitle(`${interaction.member.user.username} made a ${args.type} suggestion:`)
                    .setDescription(args.suggestion)
                    .setFooter('Made by VikingTheDev © 2021')
                    .setTimestamp()
                    .addField("Status: ", "Awaiting review")
                reply(interaction, embed);
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
                                content: 'Test',
                                // tts: true/false,
                                // embed: {
                                //    title: 'Hello!',
                                //    description: 'This is an embed'
                                //}
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
        } else if (command === 'suggestion') {
            // editPermissions(guildId, '834327111384563724', {})
            console.log(interaction)
            defer(interaction);
            setTimeout( async ()  => {
                // @ts-ignore
                await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
                    data: {
                        content: 'Hello :)'
                    }
                })
            }, 5000)
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