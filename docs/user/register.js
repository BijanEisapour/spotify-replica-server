module.exports = {
    post: {
        tags: ['user'],
        description: 'Registers the user',
        operationId: 'userPostRegister',
        parameters: [
            {
                name: 'username',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/username',
                },
                required: true,
            },
            {
                name: 'email',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/email',
                },
                required: true,
            },
            {
                name: 'password',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/password',
                },
                required: true,
            },
            {
                name: 'firstName',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/firstName',
                },
                required: false,
            },
            {
                name: 'lastName',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/lastName',
                },
                required: false,
            },
        ],
        responses: {
            200: {
                description: 'User created successfully',
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
