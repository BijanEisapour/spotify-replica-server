const one = require('./one');
const auth = require('./auth');
const logout = require('./logout');
const register = require('./register');
const login = require('./login');

module.exports = {
    paths: {
        '/user/one/{id}': {
            ...one,
        },
        '/user/auth': {
            ...auth,
        },
        '/user/logout': {
            ...logout,
        },
        '/user/register': {
            ...register,
        },
        '/user/login': {
            ...login,
        },
    },
};
