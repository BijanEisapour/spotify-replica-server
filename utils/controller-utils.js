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

const hashCompare = (word, hashed, callback) => {
    bcrypt.compare(word, hashed, callback);
};

const sendError = (res, message, status, error = 'N/A') => {
    res.status(status).send({message, error});
};

const verifyToken = (req, callback) => {
    const token = req.cookies['jwt'];

    if (!token) {
        callback(true);
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, callback);
};

module.exports = {
    createPool,
    createToken,
    hash,
    hashCompare,
    sendError,
    verifyToken,
};
