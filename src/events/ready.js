const logger = require('../modules/logger.js');

module.exports = async (client) => {
    client.guilds.cache.get(1);
    logger.log('All scripts have been loaded, and the bot is ready!', 'ready');
};