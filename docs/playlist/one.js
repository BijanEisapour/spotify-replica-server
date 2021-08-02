module.exports = {
    get: {
        tags: ['playlist'],
        description: 'Get one playlist with id',
        operationId: 'playlistGetOne',
        parameters: [
            {
                name: 'id',
                in: 'path',
                schema: {
                    $ref: '#/components/schemas/id',
                },
                required: true,
            },
        ],
        responses: {
            200: {
                description: 'Playlist found successfully',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Playlist',
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
                description: 'Playlist not found',
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
