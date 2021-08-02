module.exports = {
    get: {
        tags: ['song'],
        description: 'Get one song with id',
        operationId: 'songGetOne',
        parameters: [
            {
                name: 'id',
                in: 'path',
                schema: {
                    type: 'number',
                    example: 23,
                },
                required: true,
            },
        ],
        responses: {
            200: {
                description: 'Song found successfully',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Song',
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
                description: 'Song not found',
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
