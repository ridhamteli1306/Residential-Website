const express = require('express');
const router = express.Router();
const { login, register, getUsers, forgotPassword } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.get('/users', getUsers);

module.exports = router;
