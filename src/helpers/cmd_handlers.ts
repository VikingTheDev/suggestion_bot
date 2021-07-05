import { jsonDB } from "../db/database";
import { api, client } from "../app";
import { MessageEmbed } from "discord.js";

export const commandHandler = async (interaction: any) => {
    const { options, name } = interaction.data;
    const { guild_id, channel_id, token, id, application_id } = interaction;
    const command = name.toLowerCase();
    const intObj = { 
        id,
        appId: application_id,
        token,
        channelId: channel_id,
        guildId: guild_id
    };

    if (command === 'new') {
        const args: any = {}

        for (const option of options) {
            const { name, value } = option;
            args[name] = value;
        }
        
        api.interaction(intObj).defer();
        let id: number = await jsonDB.length() + 1;
        const embed = new MessageEmbed()
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
                { name: 'ID:', value: id, inline: true }
            )
        
        let data = await api.createAPIMessage(interaction.channel_id, embed);
        // @ts-ignore
        await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
            data
        }).then ( () => {
                jsonDB.add({
                    id,
                    data: intObj,
                    embed
                });
            }); 
    } else if (command === 'suggestion') {
        api.interaction(intObj).defer();

        const args: any = {};

        for (const option of options) {
            const { name, value } = option;
            args[name] = value;
        };

        switch (true) {
            case args.interaction === 'approve': {
                let channelId: string = await jsonDB.getChannel('approve');

                jsonDB.findById(parseInt(args.id), async cb => {
                    channelId = channelId === null ? cb.data.channelId : channelId;
                    

                    try {
                        await api.interaction(cb.data).deleteOriginal();
                    } catch (err) {}


                    let channel = client.channels.cache.get(channelId);
                    // @ts-expect-error
                    channel.send('test')
                        .then ( async () => {
                            if (channelId != cb.data.channelId) {
                                cb.data.channelId = channelId;
                                jsonDB.update(cb);
                            }
                        });

                    await api.interaction(intObj).editOriginal('Approved suggestion ``' + cb.id + '``');
                    setTimeout(async () => {
                        await api.interaction(intObj).deleteOriginal();
                    }, 5000);
                });
                break;
            }
            case args.interaction === 'delete': {
                let channelId: string = await jsonDB.getChannel('delete');
                channelId = channelId === null ? channel_id : channelId;

                jsonDB.findById(parseInt(args.id), cb => {
                    if (channelId == cb.data.channelId) {
                        // edit original
                    } else {
                        // delete original and send to diff channel
                    }
                });
                break;
            }
            case args.interaction === 'deny': {
                let channelId: string = await jsonDB.getChannel('deny');
                channelId = channelId === null ? channel_id : channelId;

                jsonDB.findById(parseInt(args.id), cb => {
                    if (channelId == cb.data.channelId) {
                        // edit original
                    } else {
                        // delete original and send to diff channel
                    }
                });
                break;
            }
            case args.interaction === 'implemented': {
                let channelId: string = await jsonDB.getChannel('implemented');
                channelId = channelId === null ? channel_id : channelId;

                jsonDB.findById(parseInt(args.id), cb => {
                    if (channelId == cb.data.channelId) {
                        // edit original
                    } else {
                        // delete original and send to diff channel
                    }
                });
                break;
            }
            case args.interaction === 'inprogress': {
                let channelId: string = await jsonDB.getChannel('inprogress');
                channelId = channelId === null ? channel_id : channelId;

                jsonDB.findById(parseInt(args.id), cb => {
                    if (channelId == cb.data.channelId) {
                        // edit original
                    } else {
                        // delete original and send to diff channel
                    }
                });
                break;
            }
        }
    } else if (command === 'config') {
        const subcommand = options[0].name;

        const args: any = {};

        for (const option of options[0].options) {
            const { name, value } = option;
            args[name] = value;
        }

        api.interaction(intObj).defer();

        if (subcommand === 'user') {

        } else if (subcommand === 'role') {

        } else if (subcommand === 'set-channel') {
            let channelName = client.guilds.cache.get(guild_id).channels.cache.get(args.channel).id;
            api.interaction(intObj).editOriginal('Successfully changed ' + '``' + args.interaction + '``'+ ' to ' + '<#' + channelName + '>');

            await jsonDB.updateChannel(args.interaction, args.channel);
        }
    }
}; 