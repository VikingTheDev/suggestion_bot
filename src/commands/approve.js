const config = require('../config.js');

exports.conf = {
    enabled: true,
    aliases: ['accept', 'a'], // aliases for the commands
    guildOnly: true,
    permLevel: "Moderator",
    mod_access: {
        "774290125973618700": [ // ID of the channel
            "814621485058359298"  // ID of the role
        ],
        "779691693897023488": [
            "861001628056682567"
        ] 
    }
};

exports.help = {
    name: "approve",
    category: "Suggestions",
    description: "Approve a suggestion. Only available to specific users and roles.",
    usage: "approve <id> [comment]"
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
    if(!client.channels.cache.get(data.channelId)) client.channels.fetch(data.channelId);
    let msg = await client.channels.cache.get(data.channelId).messages.fetch(data.messageId);

    // Check if a comment has been provided.
    let comment = args.slice(1).join(" ") ? args.slice(1).join(" ") : "No reason given";

    // Modify the original message embed to the approved embed.
    let embed = msg.embeds[0];

         // Check if votes are already counted (if you i.e. change a suggestion from approved to rejected.)
        let votes = embed.fields[2] ? embed.fields[2] : {
            name: "Votes:",
            value: `${config.emojies.approve}: ${msg.reactions.cache.get(config.emojies.approve).count}\n${config.emojies.deny}: ${msg.reactions.cache.get(config.emojies.deny).count}`
        };

        embed.color = embed.color = "2ECC71";
        embed.fields = [
            {
                name: "Status:",
                value: `Approved ${config.emojies.approve} by <@!${message.author.id}>`
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

    setTimeout(() => {
        message.delete();
    },500);
};

const checkAccess = async (client, message, level, channelId) => {
    // If the user is one level or more above the threshold, give them access.
    if(!Object.keys(this.conf.mod_access).includes(message.channel.id)) return false;
    if(level > client.container.levelCache[this.conf.permLevel]) return true;
    let res = false;
    await message.guild.members.cache.get(message.author.id).roles.cache.forEach(r => {
        for(const id of this.conf.mod_access[channelId]) {
            if (id === r.id) res = true;
        };
    }); 

    return res;
};