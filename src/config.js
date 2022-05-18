const { MessageEmbed } = require("discord.js");

const config = {
   settings: {
        "prefix": "!",
        "guildId": "REPLACE_WITH_GUILD_ID",
        "memberRole": "member",
        "memberRole": "member", // Name of role you want to grant the perm level "member"
        "systemNotice": "true",
        "modRoles": [ // Name of the roles you want to have access to make changes in specified channels.
            "Role Name", // I.e. "TPD | Chief of Police"
        ],
        "adminRoles": [ // Name of the roles you want to have access to make changes in all suggestion channels.
            "Role Name", // I.e. "SSRP | Staff Director"
        ]
   },
   // The emojies you want to use for reactions, if you want to use CUSTOM emojies you'll have to alter the code itself.
   emojies: {
       approve: '✅',
       deny: '❌'
   },
   channels: {
    "suggestions": [ // Name of the channel, LOWERCASE ONLY!!
      "Moderator"  // Name of the role
    ],
    "es-suggestions": [
      "Sheriff"
    ]
   },
   stickyMessage: {
    content: "📌 **This is a sticky message** 📌",
    embeds: [
        new MessageEmbed({
          title: 'Important, please read!',
          description: "To create a new suggestion, press the button below.\nPlease keep all suggestions serious and thorough.\nSuggestion discussion is only permitted in the suggestion's respective thread.",
          footer: {
              text: `2022 © VikingTheDev`,
              iconURL: "https://cdn.discordapp.com/attachments/562656258415525898/965286587523022908/unknown.png",
              proxyIconURL: "https://media.discordapp.net/attachments/562656258415525898/965286587523022908/unknown.png"
          }
      })
    ],
    components: [
        {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Create new suggestion here!",
                    style: 2,
                    custom_id: "send_suggestion_form"
                }
            ]
        }
    ]
   },   


   // PERMISSION LEVEL DEFINITIONS.
   // DO NOT TOUCH UNLESS YOU KNOW WHAT YOU'RE DOING, STUFF *WILL* BREAK
   permLevels: [
    // This is the lowest permission level, this is for users without a role.**
    { level: 0,
      name: "User", 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },
    { level: 1,
        name: "Member", 
        check: () => {
            try {
                const memberRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === config.settings.memberRole);
                if (memberRole && message.member.roles.cache.has(memberRole.id)) return true;
              } catch (e) {
                return false;
              }
        }
    },
    // This access level provides access to approve and deny suggestions *if* they have the correct role for the suggestion channel.
    // Should be given to i.e. department heads in their department suggestion channel.
    { level: 2,
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.cache.find(r => config.settings.modRoles.find( x => x.toLowerCase() === r.name.toLowerCase()));
          if (modRole && message.member.roles.cache.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    // This access level provides access to approve and deny suggestions in *all* suggestion channels.
    { level: 3,
      name: "Administrator", 
      check: (message) => {
        try {
            const adminRole = message.guild.roles.cache.find(r => config.settings.adminRoles.find( x => x.toLowerCase() === (r.name.toLowerCase())));
            if (adminRole && message.member.roles.cache.has(adminRole.id)) return true;
          } catch (e) {
            return false;
          }
      }
    },
    // This is the server owner.
    { level: 9,
      name: "Server Owner", 
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => {
        const serverOwner = message.author ?? message.user;
        return message.guild?.ownerId === serverOwner.id;
      }
    },

    { level: 10,
      name: "Bot Owner", 
      check: (message) => {
        const owner = message.author ?? message.user;
        return owner.id === process.env.BOT_CREATOR;
      }
    }
  ]
};

module.exports = config;