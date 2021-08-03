const express = require('express');
const cors = require('cors');
const supertest = require('supertest');

require('dotenv').config();

// constants
const ROUTES = {
    USER: require('../routes/user'),
    SONG: require('../routes/song'),
    PLAYLIST: require('../routes/playlist'),
};

// init app
const app = express();

// parse middlewares
app.use(express.json());
app.use(cors());

// routers
app.use('/user', ROUTES.USER);
app.use('/song', ROUTES.SONG);
app.use('/playlist', ROUTES.PLAYLIST);

// exports
exports.requestWithSupertest = supertest(app);
exports.token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjI3OTEyNzAwfQ.92gveaQ9UGZEEi5epNrhg-2MldXUk9MaI09vUZvCKtU';

exports.toBeSong = (song) => {
    expect(song).toHaveProperty('id');
    expect(song).toHaveProperty('name');
    expect(song).toHaveProperty('artist');
    expect(song).toHaveProperty('lyrics');
    expect(song).toHaveProperty('file');
    expect(song).toHaveProperty('cover');
};
