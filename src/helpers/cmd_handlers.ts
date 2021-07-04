import { jsonDB } from "../db/database";
import { api, client } from "../app";
import { MessageEmbed } from "discord.js";

export const commandHandler = async (interaction: any) => {
    const { options, name } = interaction.data;
    const { guild_id, channel_id, token, application_id } = interaction;
    let command = name.toLowerCase();
    if (command === 'new') {
        const args: any = {}

            for (const option of options) {
                const { name, value } = option;
                args[name] = value;
            }
            
            api.interaction(interaction).defer();
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
                
                let data = await api.createAPIMessage(interaction, embed);
                // @ts-ignore
                await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
                    data
                }).then ( () => {
                        jsonDB.add({
                            id,
                            interaction,
                            embed
                        });
                    }); 
            }, 2000)
    } else if (command === 'suggestion') {

    } else if (command === 'config') {

    }
};