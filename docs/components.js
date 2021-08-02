module.exports = {
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 7,
                    },
                    username: {
                        type: 'string',
                        example: 'BijanProgrammer',
                    },
                    email: {
                        type: 'string',
                        example: 'bijaneisapour@gmail.com',
                    },
                    first_name: {
                        type: 'string',
                        example: 'بیژن',
                    },
                    last_name: {
                        type: 'string',
                        example: 'عیسی پور',
                    },
                    password: {
                        type: 'string',
                        example: '1234',
                    },
                },
            },
            UserWithoutPassword: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 7,
                    },
                    username: {
                        type: 'string',
                        example: 'BijanProgrammer',
                    },
                    email: {
                        type: 'string',
                        example: 'bijaneisapour@gmail.com',
                    },
                    first_name: {
                        type: 'string',
                        example: 'بیژن',
                    },
                    last_name: {
                        type: 'string',
                        example: 'عیسی پور',
                    },
                },
            },
            Song: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 123,
                    },
                    name: {
                        type: 'string',
                        example: 'Something',
                    },
                    artist: {
                        type: 'string',
                        example: 'Someone',
                    },
                    lyrics: {
                        type: 'string',
                        example: 'Lots of things',
                    },
                    file: {
                        type: 'string',
                        example: 'some url',
                    },
                    cover: {
                        type: 'string',
                        example: 'some url',
                    },
                },
            },
            SongArray: {
                type: 'object',
                properties: {
                    songs: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Song',
                        },
                    },
                },
            },
            Playlist: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        example: 'Something',
                    },
                    songs: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Song',
                        },
                    },
                },
            },
            PlaylistArray: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Playlist',
                },
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'Human-readable error message',
                    },
                    error: {
                        type: 'string',
                        description: 'Stack trace',
                    },
                },
            },
            idObject: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 123,
                    },
                },
            },
            tokenObject: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 123,
                    },
                    token: {
                        type: 'string',
                        example:
                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjI3OTEyNzAwfQ.92gveaQ9UGZEEi5epNrhg-2MldXUk9MaI09vUZvCKtU',
                    },
                },
            },
        },
    },
};
