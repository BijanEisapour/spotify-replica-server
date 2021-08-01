const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

// constants
const PORT = process.env.PORT || 5000;
const ROUTES = {
    USER: require('./routes/user'),
    SONG: require('./routes/song'),
};

// variables

// init app
const app = express();

// parse middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// mysql
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env['DB_HOST'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASS'],
    database: process.env['DB_NAME'],
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected to database as ${connection.threadId}`);
});

// routers
app.get('', (req, res) => {
    res.send('Hello, friend!');
});

app.use('/user', ROUTES.USER);
app.use('/song', ROUTES.SONG);

app.listen(PORT, () => console.log(`listening on port ${PORT} ...`));
