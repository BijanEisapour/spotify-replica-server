const express = require('express');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/one/:id', userController.one);

router.post('/auth', userController.auth);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
