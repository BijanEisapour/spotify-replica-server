const express = require('express');
const playlistController = require('../controllers/playlist-controller');

const router = express.Router();

router.get('/one/:id', playlistController.one);

router.post('/create', playlistController.create);

module.exports = router;
