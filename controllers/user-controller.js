const {ErrorMessage} = require('../enums/error-message');

const {createPool, hash, sendError} = require('../utils/controller-utils');

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
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500);
                return;
            }

            if (!rows || rows.length === 0) {
                sendError(res, ErrorMessage.USER_NOT_FOUND, 404);
                return;
            }

            res.json({user: rows[0]});
        });
    });
};

exports.register = (req, res) => {
    const {username, email, firstName, lastName, password} = req.body;

    if (!username || !email || !firstName || !lastName || !password) {
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
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500);
                return;
            }

            if (rows.length > 0) {
                sendError(res, ErrorMessage.USER_ALREADY_EXISTS, 404);
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
                            [[[username, email, firstName, lastName, hashed]]],
                            (err) => {
                                connection.release();

                                if (err) {
                                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500);
                                    return;
                                }

                                res.status(200).send();
                            }
                        );
                    });
                } catch (e) {
                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500);
                }
            });
        });
    });
};
