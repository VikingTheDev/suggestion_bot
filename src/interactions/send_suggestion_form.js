const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");

exports.run = async (client, interaction) => {
    // Create a modal
    const modal = new Modal()
        .setCustomId('new_suggestion')
        .setTitle('New Suggestion');
    // Add components to the modal
    // As of now only text inputs are available
    const suggestionTitle = new TextInputComponent()
        .setCustomId('titleInput')
        // The label is the prompt the user sees for this input
        .setLabel('Title [Required]')
        // The max length of the users Input
        .setMaxLength(50)
        // The min length of the users Input
        .setMinLength(3)
        // Placeholder text in the input field
        .setPlaceholder("Title of your suggestion")
        // Whether an input is required or not
        .setRequired(true)
        // The message style, can be SHORT or PARAGRAPH. SHORT is one line of text, PARAGRAPH is multiple lines of text
        .setStyle('SHORT');
    const suggestionDescription = new TextInputComponent()
        .setCustomId('descInput')
        .setLabel('Description [Required]')
        .setMaxLength(4000)
        .setMinLength(10)
        .setPlaceholder('Please describe your suggestion in detail')
        .setRequired(true)
        .setStyle('PARAGRAPH');
    const suggestionLinks = new TextInputComponent()
        .setCustomId('linkInput')
        .setLabel('Link/links [Optional]')
        .setMaxLength(500)
        .setMinLength(0)
        .setPlaceholder('Submit all relevant links here, separate using spaces')
        .setRequired(false)
        .setStyle('SHORT')
    // An action row only holds one text input, so you need one action row per text input
    const firstActionRow = new MessageActionRow().addComponents(suggestionTitle);
    const secondActionRow = new MessageActionRow().addComponents(suggestionDescription);
    const thirdActionRow = new MessageActionRow().addComponents(suggestionLinks);
    // Add all inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    // Show the modal to the user
    await interaction.showModal(modal);
};
