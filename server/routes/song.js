const express = require('express');
const songController = require('../controllers/song-controller');

const router = express.Router();

router.get('/all', songController.all);
router.get('/one/:id', songController.one);

router.post('/page', songController.page);
router.post('/find', songController.find);

module.exports = router;
