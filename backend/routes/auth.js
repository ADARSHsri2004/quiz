const express = require('express');
const router = express.Router();
const { signup, login, logout, verify } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/verify', authenticate, verify);

module.exports = router;
