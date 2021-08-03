const {requestWithSupertest, token} = require('./server');

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
            token,
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

        expect(res.status).toEqual(400);
        expect(res.type).toEqual(expect.stringContaining('json'));

        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('کاربری با این مشخصات از قبل موجود است');
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
