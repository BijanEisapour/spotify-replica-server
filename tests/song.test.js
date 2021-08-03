const {requestWithSupertest, toBeSong} = require('./server');

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
            count: 5,
        });

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('songs');
        expect(res.body.songs).toHaveProperty('length');
        expect(res.body.songs.length).toEqual(5);

        toBeSong(res.body.songs[0]);
    });
});
