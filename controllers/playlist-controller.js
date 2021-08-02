const {ErrorMessage} = require('../enums/error-message');

const {query, sendError, verifyTokenQuery} = require('../utils/controller-utils');

exports.all = (req, res) => {
    const query1 = 'SELECT playlist.* FROM user_playlist, playlist WHERE user_id = ? AND playlist_id = playlist.id';
    const query2 = 'SELECT playlist_id, song.* FROM playlist_song, song WHERE playlist_id IN ? AND song_id = song.id';
    const options = (x) => x;
    const notFound = () => res.send([]);

    verifyTokenQuery(req, res, query1, options, notFound, (rows) => {
        const playlists = {};
        rows.forEach((x) => (playlists[x.id] = x.name));

        const playlistIds = rows.map((x) => x.id);

        query(res, query2, [[playlistIds]], null, (rows) => {
            const result = {};
            playlistIds.forEach((x) => (result[x] = {name: playlists[x], songs: []}));

            rows.forEach(({playlist_id, ...rest}) => result[playlist_id].songs.push({rest}));

            res.send(Object.values(result));
        });
    });
};

exports.one = (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.PLAYLIST_ID_REQUIRED, 400);
        return;
    }

    const query1 = 'SELECT * FROM playlist WHERE id = ?';
    const query2 =
        'SELECT song.* FROM song, playlist_song WHERE playlist_song.playlist_id = ? AND playlist_song.song_id = song.id';

    query(res, query1, id, ErrorMessage.PLAYLIST_NOT_FOUND, () =>
        query(res, query2, id, (rows) => res.json({name: rows[0].name, songs: rows}))
    );
};

exports.create = (req, res) => {
    const {name} = req.body;

    if (!name) {
        sendError(res, ErrorMessage.PLAYLIST_NAME_REQUIRED, 400);
        return;
    }

    const query1 = 'INSERT INTO playlist (name) VALUES ?';
    const query2 = 'INSERT INTO user_playlist (user_id, playlist_id) VALUES ?';

    verifyTokenQuery(req, res, query1, [[[name]]], null, ({insertId}, userId) => {
        query(res, query2, [[[userId, insertId]]], null, () => res.status(201).send({id: insertId}));
    });
};

exports.remove = (req, res) => {
    const {id} = req.body;

    if (!id) {
        sendError(res, ErrorMessage.PLAYLIST_ID_REQUIRED, 400);
        return;
    }

    const query1 = 'SELECT * FROM user_playlist WHERE user_id = ? AND playlist_id = ?';
    const query2 = 'DELETE FROM playlist WHERE id = ?';
    const options = (x) => [x, id];

    verifyTokenQuery(req, res, query1, options, ErrorMessage.PLAYLIST_NOT_FOUND, () =>
        query(res, query2, id, null, () => res.send())
    );
};

exports.addSong = (req, res) => {
    const {playlistId, songId} = req.body;

    const query1 = 'SELECT * FROM user_playlist WHERE user_id = ? AND playlist_id = ?';
    const query2 = 'SELECT * FROM song WHERE id = ?';
    const query3 = 'INSERT INTO playlist_song (playlist_id, song_id) VALUES ?';
    const options = (x) => [x, playlistId];

    verifyTokenQuery(req, res, query1, options, ErrorMessage.PLAYLIST_NOT_FOUND, () =>
        query(res, query2, [songId], ErrorMessage.SONG_NOT_FOUND, () =>
            query(res, query3, [[[playlistId, songId]]], null, () => res.status(201).send())
        )
    );
};

exports.removeSong = (req, res) => {
    const {playlistId, songId} = req.body;

    const query1 = 'SELECT * FROM user_playlist WHERE user_id = ? AND playlist_id = ?';
    const query2 = 'DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?';
    const options = (x) => [x, playlistId];

    verifyTokenQuery(req, res, query1, options, ErrorMessage.PLAYLIST_NOT_FOUND, () =>
        query(req, query2, [playlistId, songId], null, () => res.send())
    );
};
