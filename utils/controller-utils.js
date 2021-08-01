const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const createPool = () => {
    return mysql.createPool({
        connectionLimit: 100,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
};

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
};

const hash = (word, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(word, salt, (err, hash) => {
            if (err) throw err;
            callback(hash);
        });
    });
};

const sendError = (res, message, status) => {
    res.status(status).send({error: message});
};

module.exports = {
    createPool,
    createToken,
    hash,
    sendError,
};
