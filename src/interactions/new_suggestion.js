const { emojies } = require('../config.js');

exports.run = async (client, interaction) => {
    const { sDB } = client.container;

    // Ensure that the interaction is a Modal
    if (!interaction.isModalSubmit()) return;

    // Defer the reply so that the interaction does not fail
    await interaction.deferReply({ ephemeral: true });

    // Extract the data sent by the user
    const suggestionTitle = interaction.fields.getTextInputValue('titleInput');
    const suggestionDescription = interaction.fields.getTextInputValue('descInput');
    const suggestionLinks = interaction.fields.getTextInputValue('linkInput');

    // Set the ID of the suggestion based on the database size
    const id = `${sDB.data.size + 1}`;

    // Define fields depending on if there are any provided links
    let fields;
    if (suggestionLinks.length > 0) {
        fields = [
            {
                name: "Links:",
                value: suggestionLinks.replaceAll(' ', '\n')
            },
            {
                name: "Status",
                value: "Pending approval..."
            }
        ]
    } else {
        fields = [
            {
                name: "Status",
                value: "Pending approval..."
            }
        ]
    }

    // Create the embed object
    const embed = {
        author: {
            name: interaction.user.tag
        },
        title: suggestionTitle,
        description: suggestionDescription,
        fields,
        footer: {
            text: `2022 © VikingTheDev | ID: ${id}`,
            iconURL: "https://cdn.discordapp.com/attachments/562656258415525898/965286587523022908/unknown.png"
        }
    };

    // Send the suggestion to the respective suggestions channel

    interaction.channel.send({embeds: [ embed ]})
        .then (async msg => {
            msg.react(emojies.approve);
            msg.react(emojies.deny);
            sDB.set(id, msg.channel.id, msg.id);
            await msg.startThread({name: `${suggestionTitle} [ID: ${id}]`, autoArchiveDuration: 1440, reason: 'Discussion of this suggestion.', rateLimitPerUser: 60, });
        })

    // Update the interaction reply
    await interaction.editReply('Suggestion post created, you can dismiss this message.');
}