module.exports = {
    post: {
        tags: ['song'],
        description: 'Search for a phrase in name, artist or lyrics; Returns top 10',
        operationId: 'songPostFind',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            phrase: {
                                type: 'string',
                                example: 'عشق',
                            },
                        },
                        required: ['phrase'],
                    },
                },
            },
        },
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
