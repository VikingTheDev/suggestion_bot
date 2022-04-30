# Setup

## General stuff:
    - Add the Bot Token to the src/.env file.
    - Add guildId in src/config.js
    - Add modRoles and adminRoles in src/config.js, read the comments to see what the access levels provide.

## To set up suggestions:
    - Go to src/commands/new.js and add suggestion channels under "channels".
    - Go to src/commands/approve.js & src/commands/deny.js and set up moderator access under "mod_access".

## To set up the the apply command:
    Warning: This will require some "coding" to set up properly, should be doable with little to no experience as long as you've got some patience.
    - Go to src/commands/apply.js and enable the command. You'll also have to update the description for each department.
    - Go to src/events/interactionCreate.js and add a message that will be sent to the user for each department.

# TODO:
Create a sticky message in all suggestion channels, with a button to create a new suggestion.
Respond to the button interaction with a Text Input Modal.
Attach a button to the department info embeds, and respond to it with a application form Text Input Modal 