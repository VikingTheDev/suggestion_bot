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
                    id: '814621485058359298',
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
    //const commands = await getApp(guildId).commands.get()
    // console.log(commands)

    // @ts-ignore
    //const perms = await client.api.applications(client.user.id).guilds(guildId).commands('834327111384563724').permissions.get()
    //console.log(perms)
    
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
                                    value: 'Discord'
                                },
                                {
                                    name: 'In-game',
                                    value: 'In-game'
                                },
                                {
                                    name: 'Department',
                                    value: 'Department'
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
                            name: 'Links',
                            type: 3,
                            description: 'Please provide any relevant links here',
                            required: false
                        } //,
                        // {
                        //     name: 'Channel',
                        //     value: 'channel',
                        //     type: 7,
                        //     description: 'Channel to post suggestion in',
                        //     required: true
                        // }
                    ]
                }
            ]
        }
    })

    
    // Code to delete a slash command, replace numbers with ID ( !! Not application ID !!)
    // await getApp(guildId).commands('834002840614731806').delete()
    
    // @ts-ignore
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data;
        const command = name.toLowerCase();
        
        const args: any = {}

        for (const option of options[0].options) {
            const { name, value } = option;
            args[name] = value;
        }
        //console.log(interaction)
        console.log(args)

        // Might make a class instead to accommodate for sub-commands

        //console.log(interaction)

        if (command === 'suggestion') {
            defer(interaction);
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
                
                let data = await createAPIMessage(interaction, embed);
                // console.log(data)
                // @ts-ignore
                await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
                    data
                })
            }, 2000)
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