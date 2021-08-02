const express = require('express');
const playlistController = require('../controllers/playlist-controller');

const router = express.Router();

router.get('/all', playlistController.all);
router.get('/one/:id', playlistController.one);

router.post('/create', playlistController.create);
router.post('/remove', playlistController.remove);
router.post('/add-song', playlistController.addSong);
router.post('/remove-song', playlistController.removeSong);

module.exports = router;
