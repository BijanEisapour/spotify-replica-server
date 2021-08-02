module.exports = {
    components: {
        schemas: {
            id: {
                type: 'number',
                example: 123,
            },
            username: {
                type: 'string',
                example: 'BijanProgrammer',
            },
            email: {
                type: 'string',
                example: 'bijaneisapour@gmail.com',
            },
            firstName: {
                type: 'string',
                example: 'بیژن',
            },
            lastName: {
                type: 'string',
                example: 'عیسی پور',
            },
            password: {
                type: 'string',
                example: '1234',
            },
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 123,
                    },
                    username: {
                        type: 'string',
                        example: 'BijanProgrammer',
                    },
                    email: {
                        type: 'string',
                        example: 'bijaneisapour@gmail.com',
                    },
                    first_name: {
                        type: 'string',
                        example: 'بیژن',
                    },
                    last_name: {
                        type: 'string',
                        example: 'عیسی پور',
                    },
                    password: {
                        type: 'string',
                        example: '1234',
                    },
                },
            },
            UserWithoutPassword: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 123,
                    },
                    username: {
                        type: 'string',
                        example: 'BijanProgrammer',
                    },
                    email: {
                        type: 'string',
                        example: 'bijaneisapour@gmail.com',
                    },
                    first_name: {
                        type: 'string',
                        example: 'بیژن',
                    },
                    last_name: {
                        type: 'string',
                        example: 'عیسی پور',
                    },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'Human-readable error message',
                    },
                    error: {
                        type: 'string',
                        description: 'Stack trace',
                    },
                },
            },
            idObject: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 123,
                    },
                },
            },
        },
    },
};
