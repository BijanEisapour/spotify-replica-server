module.exports = {
    post: {
        tags: ['song'],
        description: 'Get list of songs with pagination and optional sort',
        operationId: 'songPostPage',
        parameters: [
            {
                name: 'size',
                in: 'body',
                schema: {
                    type: 'number',
                    example: 20,
                },
                required: true,
            },
            {
                name: 'current',
                in: 'body',
                schema: {
                    type: 'number',
                    example: 1,
                },
                required: true,
            },
            {
                name: 'sorter',
                in: 'body',
                schema: {
                    type: 'string',
                    example: 'name',
                },
                required: false,
            },
            {
                name: 'desc',
                in: 'body',
                schema: {
                    type: 'boolean',
                    example: true,
                },
                required: false,
            },
        ],
        responses: {
            200: {
                description: 'List of songs',
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
