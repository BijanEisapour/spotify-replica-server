const all = require('./all');
const one = require('./one');
const create = require('./create');
const remove = require('./remove');
const addSong = require('./add-song');
const removeSong = require('./remove-song');

module.exports = {
    paths: {
        '/playlist/all': {
            ...all,
        },
        '/playlist/one/{id}': {
            ...one,
        },
        '/playlist/create': {
            ...create,
        },
        '/playlist/remove': {
            ...remove,
        },
        '/playlist/add-song': {
            ...addSong,
        },
        '/playlist/remove-song': {
            ...removeSong,
        },
    },
};
