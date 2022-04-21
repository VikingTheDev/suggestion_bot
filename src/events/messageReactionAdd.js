const { emojies, settings } = require('../config.js');
const { conf } = require('../commands/new.js');

// Checks if reactions added in the suggestion channels are the emojies used for voting, if not they'll be removed.
module.exports = async (client, reaction, user) => {
    if(!conf.channels.includes(reaction.message.channelId)) return;
    if (reaction._emoji.name != emojies.approve && reaction._emoji.name != emojies.deny) {
        reaction.remove();
    }
};