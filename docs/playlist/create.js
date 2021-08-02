module.exports = {
    post: {
        tags: ['playlist'],
        description: 'Creates a playlist with given name',
        operationId: 'playlistPostPage',
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
                            name: {
                                type: 'string',
                                example: 'مورد علاقه‌ها',
                            },
                        },
                        required: ['name', 'token'],
                    },
                },
            },
        },
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
