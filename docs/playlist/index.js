const all = require('./all');
const one = require('./one');
const create = require('./create');

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
    },
};
