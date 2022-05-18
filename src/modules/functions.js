const logger = require("./logger.js");
const config = require("../config.js");

const permlevel = (message) => {
    let permlvl = 0;

    const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
        const currentLevel = permOrder.shift();
        if (message.guild && currentLevel.guildOnly) continue;
        if (currentLevel.check(message)) {
            permlvl = currentLevel.level;
            break;
        };
    }
    return permlvl;
};

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    logger.error(`Uncaught Exception: ${errorMsg}`);
    console.error(err);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
});
  
process.on("unhandledRejection", err => {
    logger.error(`Unhandled rejection: ${err}`);
    console.error(err);
});


module.exports = {
    permlevel
};