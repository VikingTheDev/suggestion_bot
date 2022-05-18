const { channels, stickyMessage } = require('../config.js');
const logger = require('../modules/logger.js');

module.exports = async (client) => {
    client.guilds.cache.get(1);
    logger.log('All scripts have been loaded, and the bot is ready!', 'ready');

    for(const channel of Object.keys(channels)) {
        const ch = await client.channels.cache.find(c => c.name.toLowerCase() === channel);
        if(ch.lastMessageId == null) {
           return ch.send(stickyMessage)
                .then(msg => client.container.lastSticky.set(channel, msg.id));
        }

        const msg = await ch.messages.fetch(ch.lastMessageId);
    
        if(!msg || !msg.embeds[0]) return ch.send(stickyMessage).then(msg => client.container.lastSticky.set(channel, msg.id));

        if(msg.embeds[0].description != stickyMessage.embeds[0].description) {
            ch.send(stickyMessage)
                .then(msg => client.container.lastSticky.set(channel, msg.id));
        } else {
            client.container.lastSticky.set(channel, msg.id)
        }
        
    };
};