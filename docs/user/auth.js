module.exports = {
    get: {
        tags: ['user'],
        description: 'Checks to see if user has been logged in',
        operationId: 'userGetAuth',
        parameters: [],
        responses: {
            200: {
                description: 'User is logged in',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/id',
                        },
                    },
                },
            },
            401: {
                description: 'Authentication failed',
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
