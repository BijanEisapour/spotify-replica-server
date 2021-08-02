const basicInfo = require('./basicInfo');
const components = require('./components');
const user = require('./user');
// const song = require('./song');
// const playlist = require('./playlist');

module.exports = {
    ...basicInfo,
    ...components,
    ...user,
    // ...song,
    // ...playlist,
};
