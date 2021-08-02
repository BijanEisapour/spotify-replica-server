const {ErrorMessage} = require('../enums/error-message');

const {createAndSendToken, hash, hashCompare, query, sendError, verifyToken} = require('../utils/controller-utils');

exports.one = (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.USER_ID_REQUIRED, 400);
        return;
    }

    query(res, 'SELECT * FROM user WHERE id = ?', id, ErrorMessage.USER_NOT_FOUND, (rows) => {
        const user = rows[0];
        delete user.password;

        res.json({user});
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

    const query1 = 'SELECT * FROM user WHERE username = ? OR email = ?';
    const query2 = 'INSERT INTO user (username, email, first_name, last_name, password) VALUES ?';

    query(res, query1, [username, email], ErrorMessage.USER_ALREADY_EXISTS, () => {
        try {
            hash(password, (hashed) => {
                query(res, query2, [[[username, email, firstName || '', lastName || '', hashed]]], null, ({insertId}) =>
                    createAndSendToken(res, 201, insertId)
                );
            });
        } catch (e) {
            sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, e);
        }
    });
};

exports.login = (req, res) => {
    const {username, email, password} = req.body;

    if ((!username && !email) || !password) {
        sendError(res, ErrorMessage.USER_ALL_CREDENTIALS_REQUIRED, 400);
        return;
    }

    const query1 = `SELECT * FROM user WHERE ${username ? 'username' : 'email'} = ?`;

    query(res, query1, username ? username : email, ErrorMessage.USER_NOT_FOUND, (rows) => {
        const user = rows[0];

        hashCompare(password, user.password, (err, result) => {
            if (err || !result) {
                sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
                return;
            }

            createAndSendToken(res, 200, user.id);
        });
    });
};
