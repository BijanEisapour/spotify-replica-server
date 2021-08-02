const one = require('./one');
const all = require('./all');
const page = require('./page');
const find = require('./find');

module.exports = {
    paths: {
        '/song/one/{id}': {
            ...one,
        },
        '/song/all': {
            ...all,
        },
        '/song/page': {
            ...page,
        },
        '/song/find': {
            ...find,
        },
    },
};
