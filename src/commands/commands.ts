export const new_suggestion = {
    name: 'new',
    description: 'Create a new suggestion',
    type: 1,
    default_permission: true,
    options: [
        {
            name: 'type',
            description: 'Type of suggestion',
            type: 3,
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
        },
    ]
}

export const suggestion = {
    name: 'suggestion',
    description: 'Interact with a suggestion',
    type: 1,
    default_permission: false,
    options: [
        {
            name: 'interaction',
            description: 'Type of interaction',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Approve',
                    value: 'approve'
                },
                {
                    name: 'Delete',
                    value: 'delete'
                },
                {
                    name: 'Deny',
                    value: 'deny'
                },
                {
                    name: 'Implemented',
                    value: 'implemented'
                },
                {
                    name: 'In-Progress',
                    value: 'inprogress'
                }
            ]
        },
        {
            name: 'id',
            description: 'ID of the suggestion you want to interact with',
            type: 3,
            required: true,
        }
    ]
}

export const config = {
    name: 'config',
    description: 'Change the configuration for commands.',
    type: 2,
    default_permission: false,
    options: [
        {
            name: 'set-channel',
            description: 'Set what channel a suggestion gets sent to following an interaction.',
            type: 1,
            options: [
                {
                    name: 'interaction',
                    description: 'Type of interaction',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Approve',
                            value: 'approve'
                        },
                        {
                            name: 'Delete',
                            value: 'delete'
                        },
                        {
                            name: 'Deny',
                            value: 'deny'
                        },
                        {
                            name: 'Implemented',
                            value: 'implemented'
                        },
                        {
                            name: 'In-Progress',
                            value: 'inprogress'
                        }
                    ]
                },
                {
                    name: 'channel',
                    description: 'Channel the suggestion will be sent to',
                    type: 7,
                    required: true,
                }
            ]
        },
        {
            name: 'user',
            description: 'Add or revoke access to a command for a user.',
            type: 1,
            options: [
                {
                    name: 'command',
                    description: 'Specify the command.',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'suggestion',
                            value: 'suggestion'
                        },
                        {
                            name: 'config',
                            value: 'config'
                        }
                    ]
                },
                {
                    name: 'user',
                    description: 'Specify the user.',
                    type: 6,
                    required: true,
                },
                {
                    name: 'access',
                    description: 'Choose whether or not the user has access to the command',
                    type: 5,
                    required: true,
                }
            ]

        },
        {
            name: 'role',
            description: 'Add or revoke access to a command for a role.',
            type: 1,
            options: [
                {
                    name: 'command',
                    description: 'Specify the command.',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'suggestion',
                            value: 'suggestion'
                        },
                        {
                            name: 'config',
                            value: 'config'
                        }
                    ]
                },
                {
                    name: 'role',
                    description: 'Specify the role.',
                    type: 8,
                    required: true,
                },
                {
                    name: 'access',
                    description: 'Choose whether or not the role has access to the command',
                    type: 5,
                    required: true,
                }
            ]
        }
    ]
}