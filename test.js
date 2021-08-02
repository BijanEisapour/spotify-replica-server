const express = require('express');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());
app.use(cors());

// routers
app.use('/user', ROUTES.USER);
app.use('/song', ROUTES.SONG);
app.use('/playlist', ROUTES.PLAYLIST);

const requestWithSupertest = supertest(app);

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
});
