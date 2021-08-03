const express = require('express');
const cors = require('cors');
const supertest = require('supertest');

require('dotenv').config();

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

// routers
app.use('/user', ROUTES.USER);
app.use('/song', ROUTES.SONG);
app.use('/playlist', ROUTES.PLAYLIST);

// tests
const requestWithSupertest = supertest(app);

const TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjI3OTEyNzAwfQ.92gveaQ9UGZEEi5epNrhg-2MldXUk9MaI09vUZvCKtU';

const toBeSong = (song) => {
    expect(song).toHaveProperty('id');
    expect(song).toHaveProperty('name');
    expect(song).toHaveProperty('artist');
    expect(song).toHaveProperty('lyrics');
    expect(song).toHaveProperty('file');
    expect(song).toHaveProperty('cover');
};

describe('user', () => {
    it('GET one', async () => {
        const res = await requestWithSupertest.get('/user/one/7');

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('username');
        expect(res.body.user).toHaveProperty('email');
        expect(res.body.user).toHaveProperty('first_name');
        expect(res.body.user).toHaveProperty('last_name');
        expect(res.body.user).not.toHaveProperty('password');
    });

    it('POST auth', async () => {
        const res = await requestWithSupertest.post('/user/auth').send({
            token: TOKEN,
        });

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toEqual(7);
    });

    it('POST register', async () => {
        const res = await requestWithSupertest.post('/user/register').send({
            username: 'BijanProgrammer',
            email: 'bijaneisapour@gmail.com',
            password: '1234',
            firstName: 'بیژن',
            lastName: 'عیسی پور',
        });

        expect(res.status).toEqual(500);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Something went wrong.');

        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toHaveProperty('sqlMessage');
        expect(res.body.error.sqlMessage).toEqual("Duplicate entry 'BijanProgrammer' for key 'username_UNIQUE'");
    });

    it('POST login', async () => {
        const res = await requestWithSupertest.post('/user/login').send({
            username: 'BijanProgrammer',
            email: 'bijaneisapour@gmail.com',
            password: '1234',
        });

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toEqual(7);
    });
});

describe('song', () => {
    it('GET all', async () => {
        const res = await requestWithSupertest.get('/song/all');

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('songs');
        expect(res.body.songs).toHaveProperty('length');
        expect(res.body.songs.length).toEqual(387);
    });

    it('GET one', async () => {
        const res = await requestWithSupertest.get('/song/one/23');

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('song');
        toBeSong(res.body.song);
    });

    it('POST page', async () => {
        const res = await requestWithSupertest.post('/song/page').send({
            size: 20,
            current: 1,
            sorter: 'name',
            desc: true,
        });

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('songs');
        expect(res.body.songs).toHaveProperty('length');
        expect(res.body.songs.length).toEqual(20);
    });

    it('POST find', async () => {
        const res = await requestWithSupertest.post('/song/find').send({
            phrase: 'عشق',
        });

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('songs');
        expect(res.body.songs).toHaveProperty('length');
        expect(res.body.songs.length).toBeGreaterThan(0);
    });
});

describe('playlist', () => {
    it('GET one', async () => {
        const res = await requestWithSupertest.get('/playlist/one/1');

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toEqual('جنگه دلم');

        expect(res.body).toHaveProperty('songs');
        expect(res.body.songs).toHaveProperty('length');
        expect(res.body.songs.length).toBeGreaterThan(0);
        toBeSong(res.body.songs[0]);
    });

    it('POST all', async () => {
        const res = await requestWithSupertest.post('/playlist/all').send({
            token: TOKEN,
        });

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('length');
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0].name).toEqual('مورد علاقه‌ها');

        expect(res.body[0]).toHaveProperty('songs');
    });

    it('POST create', async () => {
        const res = await requestWithSupertest.post('/playlist/create').send({
            token: TOKEN,
            name: '!!! ONLY FOR TEST !!!',
        });

        expect(res.status).toEqual(201);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('id');
    });

    it('POST remove', async () => {
        const res = await requestWithSupertest.post('/playlist/remove').send({
            token: TOKEN,
            id: -1,
        });

        expect(res.status).toEqual(404);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Cannot find the playlist.');

        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('N/A');
    });

    it('POST add-song', async () => {
        const res = await requestWithSupertest.post('/playlist/add-song').send({
            token: TOKEN,
            playlistId: 5,
            songId: 23,
        });

        expect(res.status).not.toEqual(400);
    });

    it('POST remove-song', async () => {
        const res = await requestWithSupertest.post('/playlist/remove-song').send({
            token: TOKEN,
            playlistId: 5,
            songId: 23,
        });

        expect(res.status).toEqual(200);
    });
});
