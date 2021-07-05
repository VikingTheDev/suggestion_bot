import { APIMessage } from "discord.js";
import * as commands from "../commands/commands";

interface perms extends Array<permObj>{};

interface permObj {
    id: string;
    type: number; // 1 = role, 2 = user
    permission: boolean;
};

interface createCommand {
    name: string;
    description: string;
    default_permission: boolean;
    type?: number;
    options: Array<Object>;
}

interface command extends createCommand{
    id: string;
    application_id: string;
    version: string;
    guild_id: string;
}

export interface API {
    client: any;
    guildId: string;
    commandId: string;
}

export interface interactionObj {
    id: string;
    appId: string;
    token: string;
    channelId: string;
    guildId: string;
}

export class API {

    /**
     * Creates a API objects with the parameters needed for all methods
     * @param {DiscordJS.Client} client DiscordJS.client used to access discord.js methods
     * @param {string} guildId Identifier of the guild (Discord server)
     * @example const api = new API(client, guildId);
     */

    constructor (client: any, guildId: string) {
        this.client = client;
        this.guildId = guildId;
    }
    

    /**
     * Methods for interacting with the permissions for a command.
     * @param {string} id The identifier of the command you want to interact with permissions on.
     * @returns Methods for interacting with the permissions of a command.
     * @example const perms = await api.permissions(commandId);
     */

    permissions = (commandId:string) => {
        const getApp = this.getApp;
        const command = getApp().commands(commandId);
        let perms: Array<{ id: string; type: number; permission: boolean; }> = command.permissions.get();

        return {

            /**
             * Method for getting all perms of a command.
             * @returns Array with all permission objects for the command.
             * @example await api.permissions(commandId).get()
             */

            get: async () => {
                return await perms;
            },

            /**
             * Method for adding a permission object to a command.
             * @param {permObj} data Data needed for adding a permission object. Needs to be a {@link permObj} object.
             * @example api.permissions(commandId).add({ id, type, permission});
             */

            add: async (data:permObj)  => {
                let exists = false;
                let temp = await perms;
                temp.map(perm => {
                    if (perm.id === data.id) {
                        exists = true;
                        perm.permission = data.permission;
                    }
                })
                if (!exists) {
                    perms = [...temp, data]
                }

                let command = await getApp().commands(commandId);
                command.permissions.put({
                    data: {
                        permissions: perms
                    }
                })
            },

            /**
             * Method for removing a permission object from a command.
             * @param id Identifer of the role or user you want to remove.
             * @example api.permissions(commandId).remove(id);
             */

            remove: async (id: string) => {
                let temp = await perms;
                let res = temp.filter(perm => perm.id != id);

                let command = getApp().commands(commandId);
                command.permissions.put({
                    data: {
                        permissions: res
                    }
                })
            }
        }
    }


    /**
     * Methods for interacting with an interaction (in this case slash commands)
     * @param interaction Interaction object passed by the 'INTERACTION_CREATE' event.
     * @returns methods for interacting with the interaction
     * @example const interaction = await api.interaction(interaction);
     */

    interaction = (obj: interactionObj) => {
        const client = this.client, createAPIMessage = this.createAPIMessage;

        // think about adding some error handling (try catch blocks and returning status shit)
        return {

                /**
                 * Responds to the interaction
                 * @param {string | object} response The response message. Has to either be a string or a {@link Discord.MessageEmbed()} object.
                 * @example api.interaction(interaction).reply('Hello World!);
                 */

                reply: async (response: string | object) => {
                    
                    let data: any = {
                        content: response
                    }
                
                    // Check for embeds
                    if(typeof response === 'object') {
                        data = await createAPIMessage(obj.channelId, response);
                    };
                
                    client.api.interactions(obj.id, obj.token).callback.post({
                        data: {
                            type: 4,
                            data,
                        }
                    })
                },

                /**
                 * Defers an interaction. This shows a loading animation on the users side and gives you 15 minutes to edit the response.
                 * @example api.interaction(interaction).defer();
                 */

                defer: () => {
                    client.api.interactions(obj.id, obj.token).callback.post({
                        data: {
                            type: 5,
                        }
                    })
                },

                /**
                 * Edits the original response.
                 * @param {string | object} response The response message. Has to either be a string or a {@link Discord.MessageEmbed()} object.
                 * @example api.interaction(interaction).editDefer('Hello World!)
                 */

                editOriginal: async (response: string | object) => {
                    let data: any = {
                        content: response
                    }
                
                    // Check for embeds
                    if(typeof response === 'object') {
                        data = await createAPIMessage(obj.channelId, response);
                    };

                    await client.api.webhooks(obj.appId, obj.token).messages['@original'].patch({
                        data
                    })
                },

                /**
                 * Deletes the original response.
                 * @example api.interaction(interaction).deleteOriginal();
                 */

                deleteOriginal: async () => {
                    await client.api.webhooks(obj.appId, obj.token).messages['@original'].delete();
                },

                /**
                 * Creates a follow up message to the original response.
                 * @param {string | object} response The response message. Has to either be a string or a {@link Discord.MessageEmbed()} object.
                 * @example api.interaction(interaction).createFollowup('Hello World!');
                 */

                createFollowup: async (response: string | object) => {
                    let data: any = {
                        content: response
                    }

                    // Check for embeds
                    if (typeof response === 'object') {
                        data = await createAPIMessage(obj.channelId, response);
                    }

                    await client.api.webhooks(obj.appId, obj.token).post({
                        data
                    })
                },

                /**
                 * Edits a follow up message.
                 * @param {string | object} response The response message. Has to either be a string or a {@link Discord.MessageEmbed()} object.
                 * @param {string} msgId The ID of the message you want to edit.
                 * @exmaple api.interaction(interaction).editFollowup('Hello World!', msgId);
                 */

                editFollowup: async (response: string | object, msgId: string) => {
                    let data: any = {
                        content: response
                    }
                
                    // Check for embeds
                    if(typeof response === 'object') {
                        data = await createAPIMessage(obj.channelId, response);
                    };

                    await client.api.webhooks(obj.appId, obj.token).messages[msgId].patch({
                        data
                    })
                },

                /**
                 * Deletes a follow up message.
                 * @param {string} msgId The ID of the message you want to delete.
                 * @example api.interaction(interaction).deleteFollowup(msgId);
                 */

                deleteFollowup: async (msgId: string) => {
                    await client.api.webhooks(obj.appId, obj.token).messages[msgId].delete();
                }
            }
    }


    /**
     * Methods for interacting with guild commands.
     * @param {string} commandId Optional, only needed if you want to fetch a specific command with .get()
     * @returns Methods for interacting with commands.
     * @example const cmds = api.commands(); || const { commands } = api;
     */

    commands = (commandId?: string) => {
        const getApp = this.getApp;
        let commands: Array<command> 
            = this.getApp().commands.get();

        return {

            /**
             * Returns all commands in the guild if commandId and name is undefined. If name is defined it will return the matching command.
             * If commandId is passed it will return that specific command.
             * @param name *Optional* Allows you to find a command object by name
             * @returns An array of commands or a specific command.
             */

            get: async (name?: string) => {
                if(name) {
                    let temp = await commands, res;
                    temp.map(command => {
                        if (command.name == name) {
                            res = command;
                        }
                    })
                    return res ? res : null;
                }
                if (commandId === undefined) return commands;
                else {
                    let temp = await commands;
                    let command = temp.filter(command => command.id === commandId);
                    return command.length <= 0 ? null : command;
                };
            },

            /**
             * Method for adding a new command to the guild. commandId HAS to be undefined.
             * @param {createCommand} data Data required for creating adding a new command. Needs to be a {@link createCommand} object.
             * @example api.commands().add(cmdObj);
             */

            add: async (data: createCommand) => {
                if (commandId === undefined) {
                    let temp = await commands, exists = false;
                    temp.map(command => {
                        if (command.name === data.name) {
                            exists = true;
                        }
                    })
                    if (exists) {
                        // Might want to remove this error 
                        throw new Error(`Command with name "${data.name}" already exists!`)
                    } else {
                        getApp().commands.post({
                            data
                        });
                    }
                }
            },

            /**
             * Method for removing a command from the guild. commandId HAS to be undefined.
             * @param {string} cmdName The name of the command you want to remove.
             * @example api.commands().remove('new');
             */

            // consider adding another method for when commandId is defined that allows you to delete a command without passing the name.
            remove: async (cmdName: string) => {
                let temp = await commands, deleted = false;
                temp.map(command => {
                    if (command.name === cmdName) {
                        getApp().commands(command.id).delete();
                        deleted = true;
                    }
                })
                if (!deleted) {
                    throw new Error(`Could not find command with name "${cmdName}"`);
                }
            }
        }
    }


    /**
     * Quality of life method. Drastically decreases the length of functions when working with the discord API.
     * @returns application (what's used for working with interactions).
     * @example const application = api.getApp();
     */

    getApp = () => {
        let app = this.client.api.applications(this.client.user.id).guilds(this.guildId);
        return app
    }


    /**
     * Formats embed responses correctly so that the Discord API doesn't get *angry*
     * @param interaction The interaction you're responding to.
     * @param content The embed object.
     * @returns An API Message.
     */

    createAPIMessage = async (channelId: string , content: any) => {
        const { data, files } = await APIMessage.create(
            this.client.channels.resolve(channelId),
            content
        )
            .resolveData()
            .resolveFiles()
        
        return { ...data, files }
    }


    /**
     * Checks if this application have any commands registered to this guild. If none are found the method adds all commands and attaches permissions 
     * to config and suggestion so that {@link API.permissions} works as intended.
     */

    init = async () => {
        if ((await this.commands().get()).length <= 0) {

            console.log('Commands are not set up. Starting initialization...');

            // Add all commands to the guild
            await this.commands().add(commands.config);
            await this.commands().add(commands.new_suggestion);
            await this.commands().add(commands.suggestion);

            // Get the command objects by their names, needed for finding the commandId
            let config = await this.commands().get('config'), suggestion = await this.commands().get('suggestion');
            
            // @ts-expect-error
            let config_command = this.getApp().commands(config.id);
            await config_command.permissions.put({
                data: {
                    permissions: [
                        {
                            id: '842792202366091295',
                            type: 1,
                            permission: true
                        }
                    ]   
                }
            })

            // @ts-expect-error
            let suggestion_command = this.getApp().commands(suggestion.id);
            await suggestion_command.permissions.put({
                data: {
                    permissions: [
                        {
                            id: '842792202366091295',
                            type: 1,
                            permission: true
                        }
                    ]   
                }
            })


            console.log('Initialization complete.')

        } else {
            console.log('Commands are already set up, no initialization needed.')
        }
    }
}