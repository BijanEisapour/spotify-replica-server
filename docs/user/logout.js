module.exports = {
    get: {
        tags: ['user'],
        description: 'Logs the user out',
        operationId: 'userGetLogout',
        parameters: [],
        responses: {
            200: {
                description: 'User logged out successfully',
            },
        },
    },
};
