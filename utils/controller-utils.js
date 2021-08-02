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

const createAndSendToken = (res, status, id) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET);
    res.status(status).send({id, token});
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

const query = (res, queryString, queryOptions, notFound, callback) => {
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

            if (notFound && (!rows || rows.length === 0)) {
                if (typeof notFound === 'function') notFound();
                else sendError(res, notFound, 404);
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

const verifyTokenQuery = (req, res, queryString, queryOptions, notFound, callback) => {
    verifyToken(req, (err, decodedToken) => {
        if (err) {
            sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
            return;
        }

        const options = typeof queryOptions === 'function' ? queryOptions(decodedToken.id) : queryOptions;

        query(res, queryString, options, notFound, (...args) => callback(...args, decodedToken.id));
    });
};

module.exports = {
    createAndSendToken,
    createPool,
    hash,
    hashCompare,
    query,
    sendError,
    verifyToken,
    verifyTokenQuery,
};
