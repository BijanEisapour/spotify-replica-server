const bcrypt = require('bcrypt');
const mysql = require('mysql');

const sendError = (res, message, status) => {
    res.status(status).send({error: message});
};

const createPool = () => {
    return mysql.createPool({
        connectionLimit: 100,
        host: process.env['DB_HOST'],
        user: process.env['DB_USER'],
        password: process.env['DB_PASS'],
        database: process.env['DB_NAME'],
    });
};

const hash = (word, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(word, salt, (err, hash) => {
            if (err) throw err;
            callback(hash);
        });
    });
};

module.exports = {
    createPool,
    hash,
    sendError,
};
