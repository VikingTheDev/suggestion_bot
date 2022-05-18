const config = require('../config.js');

exports.conf = {
    enabled: true,
    aliases: ['reject', 'd'], // aliases for the commands
    guildOnly: true,
    permLevel: "Moderator"
};

exports.help = {
    name: "deny",
    category: "Suggestions",
    description: "Deny a suggestion. Only available to specific users and roles.",
    usage: `deny <id> [comment]`
};

exports.run = async (client, message, args, level) => {
    const sDB = client.container.sDB;
    
    // Try to get the message data from the database. If the ID is invalid, inform the user and delete the messages
    const data = sDB.data.get(args[0]);
    if (data === undefined) {
        message.reply(`There's no suggestions with ID **${args[0]}**`)
            .then(msg => {
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                },10000);
            });
        return;
    };

    // Fetch the channel
    if(!client.channels.cache.get(data.channelId)) client.channels.fetch(data.channelId);

    //Check if the user has access to approve and deny suggestions in the specific channel.
    const access = await checkAccess(client, message, level, data.channelId);
    if (!access) {
        message.reply(`You do not have permission to approve messages in <#${data.channelId}>`)
            .then(msg => {
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 10000);
            });
        return;
    };

    // Fetch the original suggestion message.
    let msg = await client.channels.cache.get(data.channelId).messages.fetch(data.messageId);

    // Check if a comment has been provided.
    let comment = args.slice(1).join(" ") ? args.slice(1).join(" ") : "No reason given";

    // Modify the original message embed to the denied embed.
    let embed = msg.embeds[0];

        // Check if votes are already counted (if you i.e. change a suggestion from approved to rejected.)
        let votes = embed.fields[2] ? embed.fields[2] : {
            name: "Votes:",
            value: `${config.emojies.approve}: ${msg.reactions.cache.get(config.emojies.approve).count}\n${config.emojies.deny}: ${msg.reactions.cache.get(config.emojies.deny).count}`
        };

        embed.color = embed.color = "E74C3C";
        embed.fields = [
            {
                name: "Status:",
                value: `Denied ${config.emojies.deny} by <@!${message.author.id}>`
            },
            {
                name: "Reason:",
                value: comment
            },
            votes
        ];

    // Edit the original message and remove the reactions from it.
    msg.edit({embeds:[embed]});
    msg.reactions.removeAll();

    if(msg.hasThread) {
        const thread = client.channels.cache.get(data.channelId).threads.cache.find(x => x.id === msg.thread.id)
        thread.setArchived(true);
    }

    setTimeout(() => {
        message.delete();
    },500);
};

const checkAccess = async (client, message, level, channelId) => {
    // If the user is one level or more above the threshold, give them access.
    if(!Object.keys(config.channels).includes(message.channel.name)) return false;
    if(level > client.container.levelCache[this.conf.permLevel]) return true;
    let res = false;
    await message.guild.members.cache.get(message.author.id).roles.cache.forEach(r => {
        for(const name of config.channels[client.channels.cache.get(channelId).name]) {
            if (name.toLowerCase() === r.name.toLowerCase()) res = true;
        };
    }); 

    return res;
};