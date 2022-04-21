const { emojies, settings } = require('../config.js');

exports.conf = {
    enabled: true,
    aliases: ['suggestion', 'n'], // aliases for the commands
    guildOnly: true,
    permLevel: "member",
    channels: [ // Channels that will be 
        '774290125973618700',
        '779691693897023488'
    ]
};

exports.help = {
    name: "new",
    category: "Suggestions",
    description: "Create a new suggestion. Only available in suggestion channels.",
    usage: "new <suggestion text>"
};

exports.run = async (client, message, args, level) => {
    // TODO extract the suggestion from the message.
    const { author, channel } = message;
    const { sDB } = client.container;

    const channels = this.conf.channels;
    const suggestion = args.join(' ');
    
    if(!channels.includes(message.channel.id)) {
        
        if(message.author.dmChannel === null) await message.author.createDM();
        message.author.dmChannel.send(`This command can not be utilized in <#${message.channelId}>.`);
        setTimeout(() => {
            message.delete();
        }, 200);
        return;
    }

    const id = `${sDB.data.size + 1}`;

    const embed = {
        author: {
            name: author.tag
        },
        title: `${(channel.guild).members.cache.get(author.id).displayName} has made a suggestion:`,
        description: suggestion,
        fields: [
        {
            name: "Status:",
            value: "Pending approval..."
        }
        ],
        footer: {
            text: `2022 © VikingTheDev | ID: ${id}`,
            iconURL: "https://cdn.discordapp.com/attachments/562656258415525898/965286587523022908/unknown.png"
        }
    };

    channel.send({embeds: [ embed ]})
        .then (async msg => {
            msg.react(emojies.approve);
            msg.react(emojies.deny);
            sDB.set(id, msg.channel.id, msg.id);
        })

    setTimeout(() => {
        message.delete();
    }, 500);
};