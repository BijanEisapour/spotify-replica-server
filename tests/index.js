const index = require('../server');
const supertest = require('supertest');

// exports
exports.requestWithSupertest = supertest(index);
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
