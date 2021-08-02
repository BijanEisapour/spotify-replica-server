module.exports = {
    post: {
        tags: ['playlist'],
        description: 'Removes a playlist with given id',
        operationId: 'playlistPostRemove',
        parameters: [
            {
                name: 'id',
                in: 'body',
                schema: {
                    $ref: '#/components/schemas/id',
                },
                required: true,
            },
        ],
        responses: {
            200: {
                description: 'Playlist removed successfully',
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
