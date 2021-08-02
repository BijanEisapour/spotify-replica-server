module.exports = {
    post: {
        tags: ['playlist'],
        description: 'Removes song to playlist',
        operationId: 'playlistPostRemoveSong',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            playlistId: {
                                type: 'number',
                                example: 5,
                            },
                            songId: {
                                type: 'number',
                                example: 23,
                            },
                        },
                        required: ['playlistId', 'songId'],
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Song removed successfully',
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
