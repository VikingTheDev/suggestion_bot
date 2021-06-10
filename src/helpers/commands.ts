import { getApp } from "./api";
import config from "../config";

export const updateCmds = (client: any, guildId: string) => {
    getApp(client, guildId).commands.post({
        data: {
            name: 'suggestion',
            description: 'All suggestion related commands', 
            type: 2,
            default_permission: true,
            options: [
                {
                    name: 'new',
                    type: 1,
                    description: 'Create a new suggestion', 
                    options: [
                        {
                            name: 'type',
                            type: 3,
                            description: 'Type of suggestion',
                            required: true,
                            choices: [
                                {
                                    name: 'Discord',
                                    value: 'Discord'
                                },
                                {
                                    name: 'In-game',
                                    value: 'In-game'
                                },
                                {
                                    name: 'Department',
                                    value: 'Department'
                                }
                            ]
                        },
                        {
                            name: 'suggestion',
                            type: 3,
                            description: 'Describe your suggestion.',
                            required: true
                        },
                        {
                            name: 'links',
                            type: 3,
                            description: 'Please provide any relevant links here',
                            required: false
                        } //,
                        // {
                        //     name: 'Channel',
                        //     value: 'channel',
                        //     type: 7,
                        //     description: 'Channel to post suggestion in',
                        //     required: true
                        // }
                    ]
                }
            ]
        }
    })
}

export const deleteCmd = async (client: any, guildId: string, cmdId:string) => {
    try {
        await getApp(client, guildId).commands(cmdId).delete();
        return 'done';
    } catch (err) {
        if (config.enableDebug) {
            return err;
        } else {
            return 'failed';
        }
    }
};

export const getCmds = async (client: any, guildId: string) => {
    let args: any = [];
    const commands = await getApp(client, guildId).commands.get();
    commands.map((command: any) => {
        args.push({
            name: command.name,
            id: command.id,
        })
    });
    return args;
};

export const getPerms = async (client:any, guildId: string, cmdId: string) => {
    try {
        const perms: object = await getApp(client, guildId)
            .commands(cmdId).permissions.get();
        return perms;
    } catch (error) {
        if (config.enableDebug) {
            return error;
        } else {
            return null;
        }
    }
};