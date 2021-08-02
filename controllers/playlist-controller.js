const {ErrorMessage} = require('../enums/error-message');

const {createPool, createToken, hash, hashCompare, sendError, verifyToken} = require('../utils/controller-utils');

const pool = createPool();

exports.all = (req, res) => {
    verifyToken(req, (err, decodedToken) => {
        if (err) {
            sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
            return;
        }

        const userId = decodedToken.id;

        pool.getConnection((err, connection) => {
            if (err) {
                sendError(res, ErrorMessage.DATABASE, 500);
                return;
            }

            connection.query(
                'SELECT playlist.* FROM user_playlist, playlist WHERE user_id = ? AND playlist_id = playlist.id',
                userId,
                (err, rows) => {
                    connection.release();

                    if (err) {
                        sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                        return;
                    }

                    pool.getConnection((err, connection) => {
                        if (err) {
                            sendError(res, ErrorMessage.DATABASE, 500);
                            return;
                        }

                        const playlists = {};
                        rows.forEach((x) => (playlists[x.id] = x.name));

                        const playlistIds = rows.map((x) => x.id);

                        connection.query(
                            'SELECT playlist_id, song.* FROM playlist_song, song WHERE playlist_id IN ? AND song_id = song.id',
                            [[playlistIds]],
                            (err, rows) => {
                                connection.release();

                                if (err) {
                                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                                    return;
                                }

                                const result = {};
                                playlistIds.forEach((x) => (result[x] = {name: playlists[x], songs: []}));

                                rows.forEach(({playlist_id, ...rest}) => result[playlist_id].songs.push({rest}));

                                res.send(Object.values(result));
                            }
                        );
                    });
                }
            );
        });
    });
};

exports.one = (req, res) => {
    const {id} = req.params;

    if (!id) {
        sendError(res, ErrorMessage.PLAYLIST_ID_REQUIRED, 400);
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            sendError(res, ErrorMessage.DATABASE, 500);
            return;
        }

        connection.query('SELECT * FROM playlist WHERE id = ?', id, (err, rows) => {
            connection.release();

            if (err) {
                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                return;
            }

            if (!rows || rows.length === 0) {
                sendError(res, ErrorMessage.PLAYLIST_NOT_FOUND, 404);
                return;
            }

            const playlist = rows[0];

            pool.getConnection((err, connection) => {
                if (err) {
                    sendError(res, ErrorMessage.DATABASE, 500);
                    return;
                }

                connection.query(
                    'SELECT song.* FROM song, playlist_song WHERE playlist_song.playlist_id = ? AND playlist_song.song_id = song.id',
                    id,
                    (err, rows) => {
                        connection.release();

                        if (err) {
                            sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                            return;
                        }

                        res.json({name: playlist.name, songs: rows});
                    }
                );
            });
        });
    });
};

exports.create = (req, res) => {
    const {name} = req.body;

    if (!name) {
        sendError(res, ErrorMessage.PLAYLIST_NAME_REQUIRED, 400);
        return;
    }

    verifyToken(req, (err, decodedToken) => {
        if (err) {
            sendError(res, ErrorMessage.AUTHENTICATION_FAILED, 401);
            return;
        }

        const userId = decodedToken.id;

        pool.getConnection((err, connection) => {
            if (err) {
                sendError(res, ErrorMessage.DATABASE, 500);
                return;
            }

            connection.query('INSERT INTO playlist (name) VALUES ?', [[[name]]], (err, {insertId}) => {
                connection.release();

                if (err) {
                    sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                    return;
                }

                pool.getConnection((err, connection) => {
                    if (err) {
                        sendError(res, ErrorMessage.DATABASE, 500);
                        return;
                    }

                    connection.query(
                        'INSERT INTO user_playlist (user_id, playlist_id) VALUES ?',
                        [[[userId, insertId]]],
                        (err) => {
                            connection.release();

                            if (err) {
                                sendError(res, ErrorMessage.SOMETHING_WENT_WRONG, 500, err);
                                return;
                            }

                            res.status(201).send({id: insertId});
                        }
                    );
                });
            });
        });
    });
};
