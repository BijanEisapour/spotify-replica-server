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

const query = async (res, queryString, queryOptions, notFound, errorHandler) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                sendError(res, ErrorMessage.DATABASE, 500);
                reject();
                return;
            }

            connection.query(queryString, queryOptions, (err, rows) => {
                connection.release();

                if (err) {
                    if (errorHandler) {
                        if (typeof errorHandler === 'function') errorHandler(err);
                        else sendError(res, errorHandler, 500, err);
                    } else {
                        sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                    }

                    reject();
                    return;
                }

                if (notFound && (!rows || rows.length === 0)) {
                    if (typeof notFound === 'function') notFound();
                    else sendError(res, notFound, 404);

                    reject();
                    return;
                }

                resolve(rows);
            });
        });
    });
};

const sendError = (res, message, status, error = 'N/A') => {
    res.status(status).send({message, error});
};

const verifyToken = (req) => {
    return new Promise((resolve, reject) => {
        const {token} = req.body;

        if (!token) {
            reject();
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) reject(err);
            else resolve(decodedToken);
        });
    });
};

const verifyTokenQuery = async (req, res, queryString, queryOptions, notFound, errorHandler) => {
    let decodedToken;

    try {
        decodedToken = await verifyToken(req);
    } catch (err) {
        console.log('here');
        sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
        throw err;
    }

    const options = typeof queryOptions === 'function' ? queryOptions(decodedToken.id) : queryOptions;
    return [await query(res, queryString, options, notFound, errorHandler), decodedToken.id];
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
