const express = require('express');
const router = express.Router();
const { login, register, getUsers } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.get('/users', getUsers);

module.exports = router;
