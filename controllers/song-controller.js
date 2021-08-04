const {ErrorMessage} = require('../enums/error-message');
const {Sorter} = require('../enums/sorter');

const {query, sendError} = require('../utils/controller-utils');

exports.all = async (req, res) => {
    try {
        const songs = await query(res, 'SELECT * FROM song', []);
        res.json({songs});
    } catch {
        // ignored
    }
};

exports.one = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.SONG_ID_REQUIRED, 400);
        return;
    }

    try {
        const songs = await query(res, 'SELECT * FROM song WHERE id = ?', id, ErrorMessage.SONG_NOT_FOUND);
        res.json({song: songs[0]});
    } catch {
        // ignored
    }
};

exports.page = async (req, res) => {
    const {size, current, sorter, desc} = req.body;

    if (!size || size < 1) {
        sendError(res, ErrorMessage.PAGE_SIZE_NOT_VALID, 400);
        return;
    }

    if (!current || current < 1) {
        sendError(res, ErrorMessage.PAGE_NUMBER_NOT_VALID, 400);
        return;
    }

    if (sorter && !Object.values(Sorter).includes(sorter)) {
        sendError(res, ErrorMessage.SORTER_NOT_VALID, 400);
        return;
    }

    const query1 = `SELECT * FROM song ORDER BY ${sorter || 'id'} ${!desc ? 'ASC' : 'DESC'} LIMIT ?, ?`;

    try {
        const songs = await query(res, query1, [(current - 1) * size, size]);
        res.json({songs});
    } catch {
        // ignored
    }
};

exports.find = async (req, res) => {
    const {phrase, count, sorter, desc} = req.body;

    if (!phrase) {
        sendError(res, ErrorMessage.SEARCH_PHRASE_NOT_VALID, 400);
        return;
    }

    if (!count || count < 1) {
        sendError(res, ErrorMessage.COUNT_NOT_VALID, 400);
        return;
    }

    if (sorter && !Object.values(Sorter).includes(sorter)) {
        sendError(res, ErrorMessage.SORTER_NOT_VALID, 400);
        return;
    }

    const query1 = `SELECT * FROM song WHERE CONCAT(name, artist, lyrics) LIKE ? ORDER BY ${sorter || 'id'} ${
        !desc ? 'ASC' : 'DESC'
    } LIMIT ?`;

    try {
        const songs = await query(res, query1, [`%${phrase}%`, count]);
        res.json({songs});
    } catch {
        // ignored
    }
};
