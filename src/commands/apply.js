const { MessageActionRow, MessageSelectMenu } = require('discord.js');

exports.conf = {
    enabled: false,
    aliases: ['app', 'departments', 'depts'], // aliases for the command
    guildOnly: false,
    permLevel: "User",
};

exports.help = {
    name: "apply",
    category: "Misc",
    description: "Get information about the different departments, and all neccessary links to apply.",
    usage: "apply"
};

exports.run = async (client, message, args, level) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('apply_dept')
                .setPlaceholder('Select up to three departments')
                .setMaxValues(3)
                .setMinValues(1)
                .addOptions([
                    {
                        label: 'Tampa Police Department',
                        value: 'tpd',
                        description: 'Blah blah blah...',
                        emoji: {
                            name: "👮",
                            id: null
                        }
            
                    },
                    {
                        label: 'Florida Highway Patrol',
                        value: 'fhp',
                        description: 'Blah blah blah...',
                        emoji: {
                            name: "👮",
                            id: null
                        }
            
                    },
                    {
                        label: 'Hillsborough County Sheriffs Office',
                        value: 'hcso',
                        description: 'Blah blah blah...',
                        emoji: {
                            name: "👮",
                            id: null
                        }
            
                    },
                    {
                        label: 'Hillsborough County Fire and Rescue',
                        value: 'hcfr',
                        description: 'Blah blah blah...',
                        emoji: {
                            name: "🧑‍🚒",
                            id: null
                        }
            
                    },
                    {
                        label: 'Civilian Department',
                        value: 'civ',
                        description: 'Blah blah blah...',
                        emoji: {
                            name: "🧔‍♂️",
                            id: null
                        }
            
                    },
                    {
                        label: 'Staff Department',
                        value: 'staff',
                        description: 'Blah blah blah...',
                        emoji: {
                            name: "petrikov",
                            id: "785589195526635570"
                        }
            
                    },
                    {
                        label: 'Development Team',
                        value: 'dev',
                        description: 'Blah blah blah...',
                        emoji: {
                            name: "petrikov",
                            id: "785589195526635570"
                        }
            
                    },
                ])
        );
    
    
    message.reply({ content: "This is a test of select menus", components: [row]})
    
};