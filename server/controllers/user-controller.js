const mysql = require('mysql');

const ERRORS = require('../../enums/errors');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env['DB_HOST'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASS'],
    database: process.env['DB_NAME'],
});

exports.info = (req, res) => {
    const {id} = req.params;

    if (!id) res.status(400).send({error: ERRORS.USER_ID_REQUIRED});

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query('SELECT * FROM user WHERE id = ?', id, (err, rows) => {
            connection.release();

            if (err) {
                res.status(500).send({error: ERRORS.SOMETHING_WENT_WRONG});
                return;
            }

            if (!rows || rows.length === 0) {
                res.status(404).send({error: ERRORS.USER_NOT_FOUND});
                return;
            }

            const user = {...rows[0]};
            delete user.password;

            res.json({user});
        });
    });
};
