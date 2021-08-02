module.exports = {
    post: {
        tags: ['song'],
        description: 'Get list of songs with pagination and optional sort',
        operationId: 'songPostPage',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            size: {
                                type: 'number',
                                example: 20,
                            },
                            current: {
                                type: 'number',
                                example: 1,
                            },
                            sorter: {
                                type: 'string',
                                example: 'name',
                            },
                            desc: {
                                type: 'boolean',
                                example: true,
                            },
                        },
                        required: ['size', 'current'],
                    },
                },
            },
        },
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
