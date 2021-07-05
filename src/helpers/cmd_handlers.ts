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
    console.log(interaction)
    if (command === 'new') {
        const args: any = {}

            for (const option of options) {
                const { name, value } = option;
                args[name] = value;
            }
            
            api.interaction(intObj).defer();
            setTimeout( async ()  => {
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
            }, 2000)
    } else if (command === 'suggestion') {

    } else if (command === 'config') {

    }
};