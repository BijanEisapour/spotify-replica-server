const {ErrorMessage} = require('../enums/error-message');

const {
    createAndSendToken,
    hash,
    hashCompare,
    query,
    sendError,
    tryCatch,
    verifyToken,
} = require('../utils/controller-utils');

exports.one = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.USER_ID_REQUIRED, 400);
        return;
    }

    await tryCatch(res, async () => {
        const users = await query(res, 'SELECT * FROM user WHERE id = ?', id, ErrorMessage.USER_NOT_FOUND);

        const user = users[0];
        delete user.password;

        res.json({user});
    });
};

exports.auth = async (req, res) => {
    await tryCatch(res, async () => {
        const {id} = await verifyToken(req);
        res.send({id});
    });
};

exports.register = async (req, res) => {
    const {username, email, firstName, lastName, password} = req.body;

    if (!username || !email || !password) {
        sendError(res, ErrorMessage.USER_ALL_CREDENTIALS_REQUIRED, 400);
        return;
    }

    const query1 = 'SELECT * FROM user WHERE username = ? OR email = ?';
    const query2 = 'INSERT INTO user (username, email, first_name, last_name, password) VALUES ?';

    await tryCatch(res, async () => {
        const rows = await query(res, query1, [username, email]);

        if (rows.length > 0) {
            sendError(res, ErrorMessage.USER_ALREADY_EXISTS, 400);
            return;
        }

        const hashed = await hash(password);
        const {insertId} = await query(res, query2, [[[username, email, firstName || '', lastName || '', hashed]]]);

        createAndSendToken(res, 201, insertId);
    });
};

exports.login = async (req, res) => {
    const {username, email, password} = req.body;

    if ((!username && !email) || !password) {
        sendError(res, ErrorMessage.USER_ALL_CREDENTIALS_REQUIRED, 400);
        return;
    }

    const query1 = `SELECT * FROM user WHERE ${username ? 'username' : 'email'} = ?`;

    await tryCatch(res, async () => {
        const rows = await query(res, query1, username ? username : email, ErrorMessage.USER_NOT_FOUND);
        const user = rows[0];

        await hashCompare(res, password, user.password);
        createAndSendToken(res, 200, user.id);
    });
};
