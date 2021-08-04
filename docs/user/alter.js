module.exports = {
    post: {
        tags: ['user'],
        description: "Changes user's info; At least one field is required",
        operationId: 'userPostAlter',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            token: {
                                type: 'string',
                                example:
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImlhdCI6MTYyODA4OTA4MX0.zoA5YYtuexiVBlhUQn7uzvxg8_YQxLe339Xo_4sFv60',
                            },
                            username: {
                                type: 'string',
                                example: 'Test',
                            },
                            email: {
                                type: 'string',
                                example: 'test@gmail.com',
                            },
                            password: {
                                type: 'string',
                                example: '5678',
                            },
                            firstName: {
                                type: 'string',
                                example: 'یارو',
                            },
                            lastName: {
                                type: 'string',
                                example: 'فلانی',
                            },
                            avatar: {
                                type: 'string',
                                example: 'base64url',
                            },
                            gender: {
                                type: 'boolean',
                                example: true,
                            },
                            birthDate: {
                                type: 'date',
                                example: '2021-08-04',
                            },
                        },
                        required: ['token'],
                    },
                },
            },
        },
        responses: {
            200: {
                description: "User's info changed successfully",
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
                description: 'User not found',
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
