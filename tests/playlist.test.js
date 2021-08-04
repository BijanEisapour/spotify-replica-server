const {requestWithSupertest, token} = require('./index');

describe('playlist', () => {
    it('GET one', async () => {
        const res = await requestWithSupertest.get('/playlist/one/1');

        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toEqual('Collection');

        expect(res.body).toHaveProperty('songs');
        expect(res.body.songs).toHaveProperty('length');
    });

    it('POST all', async () => {
        const res = await requestWithSupertest.post('/playlist/all').send({
            token,
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
            token,
            name: '!!! ONLY FOR TEST !!!',
        });

        expect(res.status).toEqual(201);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('id');
    });

    it('POST remove', async () => {
        const res = await requestWithSupertest.post('/playlist/remove').send({
            token,
            id: -1,
        });

        expect(res.status).toEqual(404);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('لیست پخش مورد نظر یافت نشد');

        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('N/A');
    });

    it('POST add-song', async () => {
        const res = await requestWithSupertest.post('/playlist/add-song').send({
            token,
            playlistId: 5,
            songId: 23,
        });

        expect(res.status).not.toEqual(400);
    });

    it('POST remove-song', async () => {
        const res = await requestWithSupertest.post('/playlist/remove-song').send({
            token,
            playlistId: 5,
            songId: 23,
        });

        expect(res.status).toEqual(200);
    });
});
