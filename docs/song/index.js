const one = require('./one');
const all = require('./all');
const page = require('./page');
const find = require('./find');

module.exports = {
    paths: {
        '/song/all': {
            ...all,
        },
        '/song/one/{id}': {
            ...one,
        },
        '/song/page': {
            ...page,
        },
        '/song/find': {
            ...find,
        },
    },
};
