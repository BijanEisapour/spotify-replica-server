module.exports = {
    post: {
        tags: ['song'],
        description: 'Search for a phrase in name, artist or lyrics',
        operationId: 'songPostFind',
        parameters: [
            {
                name: 'phrase',
                in: 'body',
                schema: {
                    type: 'string',
                },
                required: true,
            },
        ],
        responses: {
            200: {
                description: 'List of found songs',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/SongArray',
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
