const {ErrorMessage} = require('../enums/error-message');
const {Sorter} = require('../enums/sorter');

const {createPool, sendError} = require('../utils/controller-utils');

const pool = createPool();

exports.all = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query('SELECT * FROM song', (err, rows) => {
            connection.release();

            if (err) {
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                return;
            }

            res.json({songs: rows});
        });
    });
};

exports.one = (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.SONG_ID_REQUIRED, 400);
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query('SELECT * FROM song WHERE id = ?', id, (err, rows) => {
            connection.release();

            if (err) {
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                return;
            }

            if (!rows || rows.length === 0) {
                sendError(res, ErrorMessage.SONG_NOT_FOUND, 404);
                return;
            }

            res.json({song: rows[0]});
        });
    });
};

exports.page = (req, res) => {
    const {size, current, sorter, desc} = req.body;

    if (size < 1) {
        sendError(res, ErrorMessage.PAGE_SIZE_NOT_VALID, 400);
        return;
    }

    if (current < 1) {
        sendError(res, ErrorMessage.PAGE_NUMBER_NOT_VALID, 400);
        return;
    }

    if (sorter && !Object.values(Sorter).includes(sorter)) {
        sendError(res, ErrorMessage.SORTER_NOT_VALID, 400);
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query(
            `SELECT * FROM song ORDER BY ${sorter || 'id'} ${!desc ? 'ASC' : 'DESC'} LIMIT ?, ?`,
            [(current - 1) * size, size],
            (err, rows) => {
                connection.release();

                if (err) {
                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                    return;
                }

                res.json({songs: rows});
            }
        );
    });
};

exports.find = (req, res) => {
    const {phrase} = req.body;

    if (!phrase) {
        sendError(res, ErrorMessage.SEARCH_PHRASE_NOT_VALID, 400);
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query('SELECT * FROM song WHERE CONCAT(name, artist, lyrics) LIKE ?', `%${phrase}%`, (err, rows) => {
            connection.release();

            if (err) {
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                return;
            }

            res.json({songs: rows});
        });
    });
};
