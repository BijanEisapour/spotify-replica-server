const express = require('express');
const cors = require('cors');

require('dotenv').config();

const {createPool} = require('./utils/controller-utils');

// constants
const ROUTES = {
    USER: require('./routes/user'),
    SONG: require('./routes/song'),
    PLAYLIST: require('./routes/playlist'),
};

// init app
const app = express();

// parse middlewares
app.use(express.json());
app.use(cors());

// mysql
createPool().getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected to database as ${connection.threadId}`);
});

// routers
app.get('', (req, res) => {
    res.send('Hello, friend!');
});

app.use('/user', ROUTES.USER);
app.use('/song', ROUTES.SONG);
app.use('/playlist', ROUTES.PLAYLIST);

module.exports = app;
