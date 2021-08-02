const {ErrorMessage} = require('../enums/error-message');
const {Sorter} = require('../enums/sorter');

const {query, sendError} = require('../utils/controller-utils');

exports.all = (req, res) => {
    query(res, 'SELECT * FROM song', (rows) => res.json({songs: rows}));
};

exports.one = (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.SONG_ID_REQUIRED, 400);
        return;
    }

    query(res, 'SELECT * FROM song WHERE id = ?', id, (rows) => {
        if (!rows || rows.length === 0) {
            sendError(res, ErrorMessage.SONG_NOT_FOUND, 404);
            return;
        }

        res.json({song: rows[0]});
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

    const query1 = `SELECT * FROM song ORDER BY ${sorter || 'id'} ${!desc ? 'ASC' : 'DESC'} LIMIT ?, ?`;
    query(res, query1, [(current - 1) * size, size], (rows) => res.json({songs: rows}));
};

exports.find = (req, res) => {
    const {phrase} = req.body;

    if (!phrase) {
        sendError(res, ErrorMessage.SEARCH_PHRASE_NOT_VALID, 400);
        return;
    }

    const query1 = 'SELECT * FROM song WHERE CONCAT(name, artist, lyrics) LIKE ? LIMIT 10';
    query(res, query1, `%${phrase}%`, (rows) => res.json({songs: rows}));
};
