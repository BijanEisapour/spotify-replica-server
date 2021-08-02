module.exports = {
    post: {
        tags: ['playlist'],
        description: 'Get list of all playlists and their songs',
        operationId: 'playlistGetAll',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            token: {
                                type: 'string',
                                example:
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjI3OTEyNzAwfQ.92gveaQ9UGZEEi5epNrhg-2MldXUk9MaI09vUZvCKtU',
                            },
                        },
                        required: ['token'],
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'List of all playlists and their songs',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/PlaylistArray',
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
