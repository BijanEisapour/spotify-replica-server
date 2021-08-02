const one = require('./one');
const create = require('./create');

module.exports = {
    paths: {
        '/playlist/one/{id}': {
            ...one,
        },
        '/playlist/create': {
            ...create,
        },
    },
};
