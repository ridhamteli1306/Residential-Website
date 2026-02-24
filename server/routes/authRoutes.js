const express = require('express');
const router = express.Router();
const { login, register, getUsers, forgotPassword, deleteUser, updateUser } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
