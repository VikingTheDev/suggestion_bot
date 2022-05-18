const { emojies, settings, channels } = require('../config.js');

// Checks if reactions added in the suggestion channels are the emojies used for voting, if not they'll be removed.
module.exports = async (client, reaction, user) => {
    if(!Object.keys(channels).includes(reaction.message.channel.name.toLowerCase())) return;
    if (reaction._emoji.name != emojies.approve && reaction._emoji.name != emojies.deny) {
        reaction.remove();
    }
};