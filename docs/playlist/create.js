module.exports = {
    post: {
        tags: ['playlist'],
        description: 'Creates a playlist with given name',
        operationId: 'playlistPostPage',
        parameters: [
            {
                name: 'name',
                in: 'body',
                schema: {
                    type: 'string',
                },
                required: true,
            },
        ],
        responses: {
            200: {
                description: 'Playlist created successfully',
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
