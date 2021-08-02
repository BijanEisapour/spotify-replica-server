const {ErrorMessage} = require('../enums/error-message');

const {createPool, createToken, hash, hashCompare, sendError, verifyToken} = require('../utils/controller-utils');

const pool = createPool();

exports.one = (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.USER_ID_REQUIRED, 400);
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query('SELECT * FROM user WHERE id = ?', id, (err, rows) => {
            connection.release();

            if (err) {
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                return;
            }

            if (!rows || rows.length === 0) {
                sendError(res, ErrorMessage.USER_NOT_FOUND, 404);
                return;
            }

            const user = rows[0];
            delete user.password;

            res.json({user});
        });
    });
};

exports.auth = (req, res) => {
    verifyToken(req, (err, decodedToken) => {
        if (err) {
            sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
            return;
        }

        res.send({id: decodedToken.id});
    });
};

exports.register = (req, res) => {
    const {username, email, firstName, lastName, password} = req.body;

    if (!username || !email || !password) {
        sendError(res, ErrorMessage.USER_ALL_CREDENTIALS_REQUIRED, 400);
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, email], (err, rows) => {
            connection.release();

            if (err) {
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                return;
            }

            if (rows.length > 0) {
                sendError(res, ErrorMessage.USER_ALREADY_EXISTS, 400);
                return;
            }

            pool.getConnection((err, connection) => {
                if (err) {
                    sendError(res, ErrorMessage.DATABASE, 500);
                    return;
                }

                try {
                    hash(password, (hashed) => {
                        connection.query(
                            'INSERT INTO user (username, email, first_name, last_name, password) VALUES ?',
                            [[[username, email, firstName || '', lastName || '', hashed]]],
                            (err, {insertId}) => {
                                connection.release();

                                if (err) {
                                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                                    return;
                                }

                                const token = createToken(insertId);
                                res.cookie('jwt', token, {httpOnly: true, maxAge: 365 * 24 * 60 * 60});

                                res.status(201).send({id: insertId});
                            }
                        );
                    });
                } catch (e) {
                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, e);
                }
            });
        });
    });
};

exports.login = (req, res) => {
    const {username, email, password} = req.body;

    if ((!username && !email) || !password) {
        sendError(res, ErrorMessage.USER_ALL_CREDENTIALS_REQUIRED, 400);
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query(
            `SELECT * FROM user WHERE ${username ? 'username' : 'email'} = ?`,
            username ? username : email,
            (err, rows) => {
                connection.release();

                if (err) {
                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                    return;
                }

                if (!rows || rows.length === 0) {
                    sendError(res, ErrorMessage.USER_NOT_FOUND, 404);
                    return;
                }

                const user = rows[0];

                hashCompare(password, user.password, (err, result) => {
                    if (err || !result) {
                        sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
                        return;
                    }

                    const token = createToken(user.id);
                    res.cookie('jwt', token, {httpOnly: true, maxAge: 365 * 24 * 60 * 60});

                    res.send({id: user.id});
                });
            }
        );
    });
};
