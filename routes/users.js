const express = require('express');
const router = express.Router();
const users = require('../controllers/user.js');
const auth = require('../controllers/verifyToken.js');

// GET users listing
router.get('/', users.getUsers);
router.post('/', users.createUser);
router.post('/login', users.login);
router.get('/verify', auth, users.verify);
router.post('/logout', users.logout);

module.exports = router;
