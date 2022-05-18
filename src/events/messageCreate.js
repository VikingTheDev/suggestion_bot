const { stickyMessage } = require("../config.js");
const config = require("../config.js");
const { permlevel } = require("../modules/functions.js");
const logger = require("../modules/logger.js");

const { prefix } = config.settings;

let suggestionChannels = [...Object.keys(config.channels)];

module.exports = async (client, message) => {
    const { container } = client;

    const prefixExists = new RegExp(`^<@!?${client.user.id}> |^\\${prefix}`).exec(message.content);

    if(suggestionChannels.includes(message.channel.name.toLowerCase()) && !prefixExists && !message.author.bot) {
        message.delete();
        return;
    };

    // Sticky message stuff
    for(const channel of suggestionChannels) {
        if(message.channel.type === 'DM') return;

        if(channel === message.channel.name.toLowerCase()) {
            // console.log(message.embeds[0], config.stickyMessage.embeds[0])
            if(!message.embeds[0] || message.embeds[0].description != config.stickyMessage.embeds[0].description) {
                const lastSticky = container.lastSticky.get(channel);
                message.channel.send(stickyMessage)
                    .then(async msg => {
                        try {
                            const lastMsg = await message.channel.messages.fetch(lastSticky);
                            lastMsg.delete();
                            container.lastSticky.set(channel, msg.id);
                        } catch (error) {
                            logger.error(error)
                        }
                });
            };
        };
    };

    // Ignore if the author is a bot
    if (message.author.bot) return;

    // Check if the message starts with the prefix.
    const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${prefix}\``);
    };

    // Ignore all messages that do not start with the prefix, or a bot mention.
    if (!prefixExists) return;

    // Spilt into args and find the command
    const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

      // Get the user or member's permission level from the elevation
    const level = permlevel(message);

    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));
    // using this const varName = thing OR otherThing; is a pretty efficient
    // and clean way to grab one of 2 values!
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly) 
        return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (!cmd.conf.enabled) return;

    if (level < container.levelCache[cmd.conf.permLevel]) {
        if (config.settings.systemNotice === "true") {
            return message.channel.send(`You do not have permission to use this command.
                Your permission level is ${level} (${config.permLevels.find(l => l.level === level).name})
                This command requires level ${container.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`)
                    .then(msg => setTimeout(() => {msg.delete(); message.delete();}, 10000));
        } else {
            return;
        };
    };


    // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }

    try {
        await cmd.run(client, message, args, level);
        logger.log(`${config.permLevels.find(l => l.level === level).name} ${message.author.id} ran command ${cmd.help.name}`, "cmd");
    } catch (e) {
        console.error(e);
        message.channel.send({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\`` })
            .catch(e => console.error("An error occurred replying on an error", e));
    }
};