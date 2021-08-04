const {ErrorMessage} = require('../enums/error-message');

const {query, sendError, verifyTokenQuery} = require('../utils/controller-utils');

exports.all = async (req, res) => {
    const query1 = 'SELECT playlist.* FROM user_playlist, playlist WHERE user_id = ? AND playlist_id = playlist.id';
    const query2 = 'SELECT playlist_id, song.* FROM playlist_song, song WHERE playlist_id IN ? AND song_id = song.id';
    const options = (x) => x;
    const notFound = () => res.send([]);

    try {
        let [rows] = await verifyTokenQuery(req, res, query1, options, notFound);
        const playlists = {};
        rows.forEach((x) => (playlists[x.id] = x.name));

        const result = {};
        const playlistIds = rows.map((x) => x.id);
        playlistIds.forEach((x) => (result[x] = {id: x, name: playlists[x], songs: []}));

        rows = await query(res, query2, [[playlistIds]]);
        rows.forEach(({playlist_id, ...rest}) => result[playlist_id].songs.push({rest}));

        res.send(Object.values(result));
    } catch {
        // ignored
    }
};

exports.one = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.PLAYLIST_ID_REQUIRED, 400);
        return;
    }

    const query1 = 'SELECT * FROM playlist WHERE id = ?';
    const query2 =
        'SELECT song.* FROM song, playlist_song WHERE playlist_song.playlist_id = ? AND playlist_song.song_id = song.id';

    try {
        const playlists = await query(res, query1, id, ErrorMessage.PLAYLIST_NOT_FOUND);
        const songs = await query(res, query2, id);

        res.json({name: playlists[0].name, songs});
    } catch {
        // ignored
    }
};

exports.create = async (req, res) => {
    const {name} = req.body;

    if (!name) {
        sendError(res, ErrorMessage.PLAYLIST_NAME_REQUIRED, 400);
        return;
    }

    const query1 = 'INSERT INTO playlist (name) VALUES ?';
    const query2 = 'INSERT INTO user_playlist (user_id, playlist_id) VALUES ?';

    try {
        const [{insertId}, userId] = await verifyTokenQuery(req, res, query1, [[[name]]]);
        await query(res, query2, [[[userId, insertId]]]);

        res.status(201).send({id: insertId});
    } catch {
        // ignored
    }
};

exports.remove = async (req, res) => {
    const {id} = req.body;

    if (!id) {
        sendError(res, ErrorMessage.PLAYLIST_ID_REQUIRED, 400);
        return;
    }

    const query1 = 'SELECT * FROM user_playlist WHERE user_id = ? AND playlist_id = ?';
    const query2 = 'DELETE FROM playlist WHERE id = ?';
    const options = (x) => [x, id];

    try {
        await verifyTokenQuery(req, res, query1, options, ErrorMessage.PLAYLIST_NOT_FOUND);
        await query(res, query2, id);
        res.send();
    } catch {
        // ignored
    }
};

exports.addSong = async (req, res) => {
    const {playlistId, songId} = req.body;

    const query1 = 'SELECT * FROM user_playlist WHERE user_id = ? AND playlist_id = ?';
    const query2 = 'SELECT * FROM song WHERE id = ?';
    const query3 = 'INSERT INTO playlist_song (playlist_id, song_id) VALUES ?';
    const options = (x) => [x, playlistId];
    const errorHandler = () => sendError(res, ErrorMessage.PLAYLIST_SONG_ALREADY_ADDED, 400);

    try {
        await verifyTokenQuery(req, res, query1, options, ErrorMessage.PLAYLIST_NOT_FOUND);
        await query(res, query2, [songId], ErrorMessage.SONG_NOT_FOUND);
        await query(res, query3, [[[playlistId, songId]]], null, errorHandler);

        res.send();
    } catch {
        // ignored
    }
};

exports.removeSong = async (req, res) => {
    const {playlistId, songId} = req.body;

    const query1 = 'SELECT * FROM user_playlist WHERE user_id = ? AND playlist_id = ?';
    const query2 = 'DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?';
    const options = (x) => [x, playlistId];

    try {
        await verifyTokenQuery(req, res, query1, options, ErrorMessage.PLAYLIST_NOT_FOUND);
        await query(req, query2, [playlistId, songId]);

        res.send();
    } catch {
        // ignored
    }
};
