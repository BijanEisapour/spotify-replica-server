const express = require('express');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/one/:id', userController.one);
router.get('/auth', userController.auth);
router.get('/logout', userController.logout);

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
