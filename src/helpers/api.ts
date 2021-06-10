import { APIMessage } from "discord.js";

export const getApp = (client: any, guildId: string) => {
    let app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

export interface perms extends Array<permObj>{};

export interface permObj {
    id: string;
    type: number; // 1 = role, 2 = user
    permission: boolean;
};

export const editPermissions = (client: any, guildId: string, commandId: string, data: perms) => {
    // @ts-ignore
    let command = client.api.applications(client.user.id).guilds(guildId).commands(commandId);
    command.permissions.put({
        data: {
            permissions: data
        }
    })
}

export const reply = async (client: any, interaction: object, response: string | object) => { 
    let data: any = {
        content: response
    }

    // Check for embeds
    if(typeof response === 'object') {
        data = await createAPIMessage(client, interaction, response);
    };

    // @ts-expect-error
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data,
        }
    })
}

export const defer = async (client: any, interaction: object) => {
    // @ts-expect-error
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 5,
        }
    })
}

export const editDefer = async (client: any, interaction: object, response: string | object) => {
    let data: any = {
        content: response
    }

    // Check for embeds
    if(typeof response === 'object') {
        data = await createAPIMessage(client, interaction, response);
    };
    // @ts-expect-error
    await client.api.webhooks(interaction.application_id, interaction.token).messages['@original'].patch({
        data
    })
}

export const createAPIMessage = async (client: any, interaction: any, content: any) => {
    const { data, files } = await APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    )
        .resolveData()
        .resolveFiles()
    
    return { ...data, files }
}