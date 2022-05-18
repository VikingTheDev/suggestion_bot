
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");


const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require("fs");
const DB = require('./modules/database.js');
const { permLevels, settings } = require('./config.js');
const logger = require("./modules/Logger.js");
require('dotenv').config();

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS);

const client = new Client({ intents: myIntents, partials: ['REACTION', 'MESSAGE', 'CHANNEL'] });

// Add collections where data can be stored for reading in other files.
const commands = new Collection();
const aliases = new Collection();
const functions = new Collection();
const interactions = new Collection();
const lastSticky = new Collection();

const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To prevent client pollution all collections are added into a "container".
client.container = {
    commands,
    interactions,
    aliases,
    functions,
    levelCache,
    settings,
    lastSticky
};

const init = async () => {
    // Database shit
    client.container.sDB = new DB('suggestions.json');

    client.container.sDB.read();

    const cmdFiles = readdirSync("./src/commands/").filter(file => file.endsWith(".js"));
    for (const file of cmdFiles) {
        const props = require(`./commands/${file}`);
        logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
        client.container.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.container.aliases.set(alias, props.help.name);
        });
    };

    const eventFiles = readdirSync("./src/events/").filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
        const eventName = file.split(".")[0];
        logger.log(`Loading EventHandler: ${eventName}. 👌`, "log");
        const event = require(`./events/${file}`);
        // Bind the client to any event, before the existing arguments
        // provided by the discord.js event. 
        client.on(eventName, event.bind(null, client));
    };

    const interactionFiles = readdirSync("./src/interactions/").filter(file => file.endsWith(".js"));
    for (const file of interactionFiles) {
      const interactionName = file.split(".")[0];
      const prop = require(`./interactions/${file}`);
      logger.log(`Loading interaction: ${interactionName} 👌`, "log");
      client.container.interactions.set(interactionName, prop);
    };

    const formFiles = readdirSync("./src/app_handlers/").filter(file => file.endsWith(".js"));
    for (const file of formFiles) {
      const formName = file.split(".")[0];
      const prop = require(`./app_handlers/${file}`);
      logger.log(`Loading application form handler: ${formName} 👌`, "log");
      client.container.appHandlers.set(formName, prop);
    };

    try { client.login(process.env.TOKEN) } catch (err) { console.log(err.message) };
};

init();