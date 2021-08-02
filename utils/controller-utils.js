const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const {ErrorMessage} = require('../enums/error-message');

const createPool = () => {
    return mysql.createPool({
        connectionLimit: 100,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
};

const pool = createPool();

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

const query = (res, queryString, queryOptions, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query(queryString, queryOptions, (err, rows) => {
            connection.release();

            if (err) {
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                return;
            }

            callback(rows);
        });
    });
};

const sendError = (res, message, status, error = 'N/A') => {
    res.status(status).send({message, error});
};

const verifyToken = (req, callback) => {
    const {token} = req.body;

    if (!token) {
        callback(true);
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, callback);
};

const verifyTokenQuery = (req, res, queryString, queryOptions, callback) => {
    verifyToken(req, (err, decodedToken) => {
        if (err) {
            sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
            return;
        }

        const options = typeof queryOptions === 'function' ? queryOptions(decodedToken.id) : queryOptions;

        query(res, queryString, options, (...args) => callback(...args, decodedToken.id));
    });
};

module.exports = {
    createToken,
    hash,
    hashCompare,
    query,
    sendError,
    verifyToken,
    verifyTokenQuery,
};
