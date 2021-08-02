module.exports = {
    post: {
        tags: ['user'],
        description: "Logs the user in; At least of the 'username' or 'email' fields has to be present",
        operationId: 'userPostLogin',
        parameters: [
            {
                name: 'username',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/username',
                },
                required: false,
            },
            {
                name: 'email',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/email',
                },
                required: false,
            },
            {
                name: 'password',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/password',
                },
                required: true,
            },
        ],
        responses: {
            200: {
                description: 'User logged in successfully',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/idObject',
                        },
                    },
                },
            },
            400: {
                description: 'Bad request',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
            404: {
                description: 'User not found',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
            500: {
                description: 'Server error',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
        },
    },
};
