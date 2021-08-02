module.exports = {
    get: {
        tags: ['song'],
        description: 'Get list of all songs',
        operationId: 'songGetAll',
        parameters: [],
        responses: {
            200: {
                description: 'List of all songs',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/SongArray',
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
