module.exports = {
    get: {
        tags: ['playlist'],
        description: 'Get list of all playlists and their songs',
        operationId: 'playlistGetAll',
        parameters: [],
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
