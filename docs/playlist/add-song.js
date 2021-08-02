module.exports = {
    post: {
        tags: ['playlist'],
        description: 'Adds song to playlist',
        operationId: 'playlistPostAddSong',
        parameters: [
            {
                name: 'playlistId',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/id',
                },
                required: true,
            },
            {
                name: 'songId',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/id',
                },
                required: true,
            },
        ],
        responses: {
            200: {
                description: 'Song added successfully',
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
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
            404: {
                description: 'Not found',
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