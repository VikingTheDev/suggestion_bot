const { channels, stickyMessage } = require('../config.js');
const logger = require('../modules/logger.js');

module.exports = async (client) => {
    client.guilds.cache.get(1);
    logger.log('All scripts have been loaded, and the bot is ready!', 'ready');

    //Sticky message stuff
    // Iterate through all suggestion channels
    for(const channel of Object.keys(channels)) {
        console.log(channel);
        stickyInit(client, channel);
    };
};

const stickyInit = async (client, channel) => {
    // If the channel does not have any messages send a sticky message and return
    const ch = await client.channels.cache.find(c => c.name.toLowerCase() === channel);
    if(ch.type === 'GUILD_CATEGORY') return;
    if(ch.lastMessageId == null) {
        return client.container.lastSticky.set(channel, await ch.send(stickyMessage));
    };

    // Attempt to fetch the latest message sent in the channel.
    let msg;
    try {
        msg = await ch.messages.fetch(ch.lastMessageId);
    } catch (err) {
        if(err.code != 10008) logger.error(err);
    };

    // If the last message "does not exist" i.e. it has been deleted, send a sticky message and return
    if(!msg) {
        return client.container.lastSticky.set(channel, await ch.send(stickyMessage));
    };

    // Check if the message has an embed, and if the embed matches the sticky message. If it does do nothing, if it doesn't send a sticky message.
    if(!msg.embeds[0]) return ch.send(stickyMessage).then(msg => client.container.lastSticky.set(channel, msg.id));
    if(msg.embeds[0].description == stickyMessage.embeds[0].description) {
        client.container.lastSticky.set(channel, msg)
    } else {
        client.container.lastSticky.set(channel, await ch.send(stickyMessage));
    };
};